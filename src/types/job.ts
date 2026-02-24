import type { Database } from './database';

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export type JobType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'gig';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';

export type JobWithCompany = Job & {
  company: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};
