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
}
