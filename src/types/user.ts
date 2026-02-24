import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type UserRole = 'creator' | 'buyer' | 'company';

export type StudioProfile = Profile & {
  follower_count: number;
  design_count: number;
  total_earnings: number;
};
