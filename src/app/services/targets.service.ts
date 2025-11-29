import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TargetsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  async getTargets() {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*');

    if (error) {
      console.error('[TargetsService] getTargets error', error);
      return [] as any[];
    }
    return data || [];
  }

  async getTargetsByUser(userId: string) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[TargetsService] getTargetsByUser error', error);
      return [] as any[];
    }
    return data || [];
  }

  async getTargetById(id: number) {
    const { data, error } = await this.supabase
      .from('targets')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('[TargetsService] getTargetById error', error);
      return null;
    }
    return data;
  }
}
