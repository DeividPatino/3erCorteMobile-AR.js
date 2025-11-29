import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: false,
})
export class UploadPage {
  targetName = '';
  previewFile!: File;
  pattFile!: File;
  modelFile!: File;
  uploading = false;
  description = '';

  constructor(private supabaseService: SupabaseService, private firebaseAuth: FirebaseAuthService) {}

  onPreviewSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (file) this.previewFile = file;
  }

  onFileSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (file) this.pattFile = file;
  }

  onModelSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (file) this.modelFile = file;
  }

  async upload() {
    if (!this.targetName || !this.previewFile || !this.pattFile) {
      const faltan: string[] = [];
      if (!this.targetName) faltan.push('nombre');
      if (!this.previewFile) faltan.push('preview');
      if (!this.pattFile) faltan.push('archivo AR (.patt)');
      alert('Faltan: ' + faltan.join(', '));
      return;
    }

    this.uploading = true;
    try {
      const timestamp = Date.now();
        console.log('Subiendo preview:', {
          name: this.previewFile.name,
          size: this.previewFile.size,
          type: this.previewFile.type
        });
      // 1. Subir preview
      const previewPath = `previews/${timestamp}-${this.previewFile.name}`;
      const { error: previewError } = await this.supabaseService.uploadAsset(this.previewFile, previewPath);
      if (previewError) {
        console.error('Preview upload error:', previewError);
        const msg = (previewError.message || previewError).toString();
        if (msg.includes('row-level security')) {
          alert('Error RLS al subir preview: falta política INSERT en storage.objects para bucket ar-assets. Sigue las instrucciones de políticas.');
        } else {
          alert('Error subiendo preview: ' + msg);
        }
        return;
      }
      const previewURL = this.supabaseService.getPublicUrl(previewPath);

      // 2. Subir archivo AR (PAT/NFT)
        console.log('Subiendo marker:', {
          name: this.pattFile.name,
          size: this.pattFile.size,
          type: this.pattFile.type
        });
      const pattPath = `targets/${timestamp}-${this.pattFile.name}`;
      const { error: pattError } = await this.supabaseService.uploadAsset(this.pattFile, pattPath);
      if (pattError) {
        console.error('Marker upload error:', pattError);
        const msg = (pattError.message || pattError).toString();
        if (msg.includes('row-level security')) {
          alert('Error RLS al subir marker: falta política INSERT en storage.objects para bucket ar-assets.');
        } else {
          alert('Error subiendo archivo AR: ' + msg);
        }
        return;
      }
      const markerURL = this.supabaseService.getPublicUrl(pattPath);

      // 3. Subir modelo GLTF/GLB opcional
      let modelURL: string | null = null;
      if (this.modelFile) {
        console.log('Subiendo modelo 3D:', {
          name: this.modelFile.name,
          size: this.modelFile.size,
          type: this.modelFile.type
        });
        const modelPath = `models/${timestamp}-${this.modelFile.name}`;
        const { error: modelError } = await this.supabaseService.uploadAsset(this.modelFile, modelPath);
        if (modelError) {
          console.error('Model upload error:', modelError);
          const msg = (modelError.message || modelError).toString();
          if (msg.includes('row-level security')) {
            alert('Error RLS al subir modelo: falta política INSERT en storage.objects para bucket ar-assets.');
          } else {
            alert('Error subiendo modelo 3D (se continuará sin modelo): ' + msg);
          }
        } else {
          modelURL = this.supabaseService.getPublicUrl(modelPath);
        }
      }

      // 4. Insertar registro con descripción + user_id + model_url (si existe)
      const uid = this.firebaseAuth.currentUser()?.uid || null;
      const inserted = await this.supabaseService.addTarget(this.targetName, markerURL, previewURL, this.description.trim(), uid);
      if (modelURL && inserted?.[0]?.id) {
        try {
          await this.supabaseService.updateTarget(inserted[0].id, { model_url: modelURL });
        } catch (e) {
          console.warn('No se pudo actualizar model_url tras insert:', e);
        }
      }
      alert('Target subido correctamente');
      this.targetName = '';
      this.previewFile = undefined as any;
      this.pattFile = undefined as any;
      this.modelFile = undefined as any;
      this.description = '';
    } catch (e: any) {
      alert(e?.message || 'Error desconocido');
    } finally {
      this.uploading = false;
    }
  }
}
