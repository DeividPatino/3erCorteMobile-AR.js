import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-ar',
  templateUrl: './ar.page.html',
  styleUrls: ['./ar.page.scss'],
  standalone: false,
})
export class ArPage implements AfterViewInit {
  target: any;
  saving = false;
  saveMessage = '';

  constructor(private router: Router, private supabase: SupabaseService) {
    const nav = this.router.getCurrentNavigation();
    this.target = nav?.extras?.state?.['target'];
  }

  ngAfterViewInit() {
    if (!this.target?.marker_url) {
      console.warn('No target received or marker_url missing');
      return;
    }
    const marker = document.querySelector('#dynamic-marker');
    marker?.setAttribute('url', this.target.marker_url);
  }

  async saveTarget() {
    if (!this.target?.id) {
      this.saveMessage = 'Target sin id; no se puede actualizar.';
      return;
    }
    this.saving = true;
    this.saveMessage = '';
    try {
      const updated = await this.supabase.updateTarget(this.target.id, {
        description: this.target.description,
        name: this.target.name,
        marker_url: this.target.marker_url,
        preview_url: this.target.preview_url
      });
      this.saveMessage = 'Guardado.';
      if (updated) this.target = updated;
    } catch (e: any) {
      const msg = e?.message || e;
      if (msg.includes('row-level security')) {
        this.saveMessage = 'RLS bloquea UPDATE en targets. Crear política para update.';
      } else {
        this.saveMessage = 'Error: ' + msg;
      }
    } finally {
      this.saving = false;
      setTimeout(() => { this.saveMessage = ''; }, 2500);
    }
  }
}
