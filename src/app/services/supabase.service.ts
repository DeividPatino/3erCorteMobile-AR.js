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
    // Sanitizar el path para evitar caracteres problemáticos
    const safePath = path.replace(/[^a-zA-Z0-9._/\-]/g, '_');
    return this.supabase.storage
      .from('ar-assets')
      .upload(safePath, file, { upsert: true, contentType: file.type || 'application/octet-stream' });
  }

  // Debug: list buckets (will fail if anon key lacks permissions to list)
  async listBuckets() {
    try {
      const { data, error } = await this.supabase.storage.listBuckets();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('No se pudo listar buckets con la anon key:', e);
      return [];
    }
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

  async addTarget(name: string, markerUrl: string, preview: string, description: string = '', userId: string | null = null) {
    // Intento principal incluyendo user_id; si falla por columna inexistente, reintento sin ella.
    let insertPayload: any = {
      name,
      description,
      marker_url: markerUrl,
      preview_url: preview,
      user_id: userId,
      model_url: null // se establecerá si se provee luego en update o soportado desde formulario extendido
    };
    let { data, error } = await this.supabase.from('targets').insert(insertPayload).select('*');
    if (error && error.message?.includes('user_id')) {
      console.warn('[Supabase] Columna user_id ausente, reinsertando sin user_id. Ejecuta migración para agregarla.');
      delete insertPayload.user_id;
      const retry = await this.supabase.from('targets').insert(insertPayload).select('*');
      if (retry.error) throw retry.error;
      return retry.data;
    }
    if (error) throw error;
    return data;
  }

  async updateTarget(id: number, fields: { name?: string; description?: string; marker_url?: string; preview_url?: string; user_id?: string; model_url?: string }) {
    const { data, error } = await this.supabase
      .from('targets')
      .update(fields)
      .eq('id', id)
      .select('*');
    if (error) {
      if (error.message?.includes('user_id')) {
        console.warn('[Supabase] Columna user_id ausente, actualización ignorando user_id.');
        const clone = { ...fields };
        delete clone.user_id;
        const retry = await this.supabase
          .from('targets')
          .update(clone)
          .eq('id', id)
          .select('*');
        if (retry.error) throw retry.error;
        return retry.data?.[0];
      }
      throw error;
    }
    return data?.[0];
  }

  async getTargetsByUser(userId: string) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getTargetById(id: number) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
}
