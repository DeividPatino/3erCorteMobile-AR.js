import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  uploadAsset(file: File, path: string) {
    return this.supabase.storage
      .from('ar-assets')
      .upload(path, file, { upsert: true });
  }

  getPublicUrl(path: string) {
    return this.supabase
      .storage
      .from('ar-assets')
      .getPublicUrl(path)
      .data.publicUrl;
  }

  async getTargets() {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addTarget(name: string, markerUrl: string, preview: string, description: string = '') {
    const { data, error } = await this.supabase.from('targets').insert({
      name,
      description,
      marker_url: markerUrl,
      preview_url: preview
    }).select('*');

    if (error) throw error;
    return data;
  }
}
