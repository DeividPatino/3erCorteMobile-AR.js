import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

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
  uploading = false;

  constructor(private supabaseService: SupabaseService) {}

  onPreviewSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (file) this.previewFile = file;
  }

  onFileSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (file) this.pattFile = file;
  }

  async upload() {
    if (!this.targetName || !this.previewFile || !this.pattFile) {
      alert('Debe llenar todos los campos.');
      return;
    }

    this.uploading = true;
    try {
      const timestamp = Date.now();
      // 1. Subir preview
      const previewPath = `previews/${timestamp}-${this.previewFile.name}`;
      const { error: previewError } = await this.supabaseService.uploadAsset(this.previewFile, previewPath);
      if (previewError) {
        alert('Error subiendo preview');
        return;
      }
      const previewURL = this.supabaseService.getPublicUrl(previewPath);

      // 2. Subir archivo AR (PAT/NFT)
      const pattPath = `targets/${timestamp}-${this.pattFile.name}`;
      const { error: pattError } = await this.supabaseService.uploadAsset(this.pattFile, pattPath);
      if (pattError) {
        alert('Error subiendo archivo AR');
        return;
      }
      const pattURL = this.supabaseService.getPublicUrl(pattPath);

      // 3. Insertar registro
      await this.supabaseService.addTarget(this.targetName, pattURL, previewURL);
      alert('Target subido correctamente');
      this.targetName = '';
      this.previewFile = undefined as any;
      this.pattFile = undefined as any;
    } catch (e: any) {
      alert(e?.message || 'Error desconocido');
    } finally {
      this.uploading = false;
    }
  }
}
