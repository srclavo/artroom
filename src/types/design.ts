import type { Database } from './database';

export type Design = Database['public']['Tables']['designs']['Row'];
export type DesignInsert = Database['public']['Tables']['designs']['Insert'];
export type DesignUpdate = Database['public']['Tables']['designs']['Update'];

export type DesignWithCreator = Design & {
  creator: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  };
};

export type DesignCategory =
  | 'branding'
  | 'ui-ux'
  | 'typography'
  | 'motion'
  | 'illustration'
  | '3d'
  | 'template';

export type LicenseType = 'personal' | 'commercial' | 'extended';
export type DesignStatus = 'draft' | 'published' | 'archived';
