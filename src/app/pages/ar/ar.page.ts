import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.page.html',
  styleUrls: ['./ar.page.scss'],
  standalone: false,
})
export class ArPage implements OnInit, OnDestroy, AfterViewInit {
  target: any = null;
  loading = true;
  private idParam: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private supabase: SupabaseService) {
    const nav = this.router.getCurrentNavigation();
    this.target = nav?.extras?.state?.['target']; // fallback si existe state
  }

  async ngOnInit() {
    document.body.classList.add('ar-active');
    const qp = this.route.snapshot.queryParamMap;
    const idStr = qp.get('id');
    if (idStr) {
      const id = parseInt(idStr, 10);
      if (!isNaN(id)) {
        this.idParam = id;
        try {
          this.target = await this.supabase.getTargetById(id);
        } catch (e) {
          console.warn('Error cargando target', e);
        }
      }
    }
    this.loading = false;
  }

  ngAfterViewInit() {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('loaded', () => {
        this.makeSceneTransparent();
        this.initMarker();
        this.buildScene(this.target);
      });
    } else {
      setTimeout(() => {
        this.makeSceneTransparent();
        this.initMarker();
        this.buildScene(this.target);
      }, 300);
    }
  }

  private initMarker() {
    if (!this.target?.marker_url) return;
    const marker = document.getElementById('marker');
    if (!marker) return;
    marker.setAttribute('url', this.target.marker_url);
    // Sin entidad visual: solo cámara para evitar cuadro negro.
  }

  // Lógica anterior de escalado eliminada para usar estilos CSS simples
  private makeSceneTransparent() {
    try {
      const sceneEl: any = document.querySelector('a-scene');
      if (sceneEl && sceneEl.renderer && sceneEl.renderer.setClearColor) {
        sceneEl.renderer.setClearColor('#000000', 0); // alpha 0
      }
      document.querySelectorAll('canvas').forEach(c => (c as HTMLElement).style.background = 'transparent');
    } catch {}
  }

  private buildScene(target: any) {
    if (!target) return;
    const scene = document.querySelector('a-scene');
    const marker = scene?.querySelector('#marker') as HTMLElement | null;
    if (!scene || !marker) return;

    // aplicar patrón (pattern por defecto; soportar nft si se agrega)
    marker.setAttribute('type', target.marker_type === 'nft' ? 'nft' : 'pattern');
    marker.setAttribute('url', target.marker_url);

    // limpiar hijos previos
    Array.from(marker.children).forEach(c => c.remove());

    // decidir qué renderizar
    if (target.model_url) {
      const entity = document.createElement('a-entity');
      entity.setAttribute('gltf-model', target.model_url);
      entity.setAttribute('scale', target.model_scale || '1 1 1');
      entity.setAttribute('rotation', target.model_rotation || '0 0 0');
      entity.setAttribute('position', '0 0 0');
      marker.appendChild(entity);
    } else if (target.preview_url) {
      const img = document.createElement('a-image');
      img.setAttribute('src', target.preview_url);
      img.setAttribute('rotation', '-90 0 0');
      img.setAttribute('position', '0 0 0');
      img.setAttribute('width', '1');
      img.setAttribute('height', '1');
      marker.appendChild(img);
    } else {
      const box = document.createElement('a-box');
      box.setAttribute('color', '#FF0000');
      box.setAttribute('depth', '0.1');
      box.setAttribute('height', '0.5');
      box.setAttribute('width', '0.5');
      marker.appendChild(box);
    }
  }

  // Mantener página mínima, navegación se hace con botón atrás del dispositivo

  ngOnDestroy(): void {
    document.body.classList.remove('ar-active');
  }
}
