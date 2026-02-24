export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          cover_image_url: string | null;
          role: 'creator' | 'buyer' | 'company';
          wallet_address: string | null;
          stripe_account_id: string | null;
          website_url: string | null;
          social_links: Json;
          skills: string[];
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          role?: 'creator' | 'buyer' | 'company';
          wallet_address?: string | null;
          stripe_account_id?: string | null;
          website_url?: string | null;
          social_links?: Json;
          skills?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          role?: 'creator' | 'buyer' | 'company';
          wallet_address?: string | null;
          stripe_account_id?: string | null;
          website_url?: string | null;
          social_links?: Json;
          skills?: string[];
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      designs: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          price: number;
          currency: string;
          category: string;
          subcategory: string | null;
          tags: string[];
          thumbnail_url: string;
          preview_urls: string[];
          file_url: string | null;
          file_size: number | null;
          file_format: string | null;
          license_type: 'personal' | 'commercial' | 'extended';
          view_count: number;
          download_count: number;
          like_count: number;
          is_featured: boolean;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          price?: number;
          currency?: string;
          category: string;
          subcategory?: string | null;
          tags?: string[];
          thumbnail_url: string;
          preview_urls?: string[];
          file_url?: string | null;
          file_size?: number | null;
          file_format?: string | null;
          license_type?: 'personal' | 'commercial' | 'extended';
          view_count?: number;
          download_count?: number;
          like_count?: number;
          is_featured?: boolean;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          currency?: string;
          category?: string;
          subcategory?: string | null;
          tags?: string[];
          thumbnail_url?: string;
          preview_urls?: string[];
          file_url?: string | null;
          file_size?: number | null;
          file_format?: string | null;
          license_type?: 'personal' | 'commercial' | 'extended';
          view_count?: number;
          download_count?: number;
          like_count?: number;
          is_featured?: boolean;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          price: number;
          thumbnail_url: string;
          preview_urls: string[];
          category: string | null;
          tags: string[];
          view_count: number;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          price?: number;
          thumbnail_url: string;
          preview_urls?: string[];
          category?: string | null;
          tags?: string[];
          view_count?: number;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          thumbnail_url?: string;
          preview_urls?: string[];
          category?: string | null;
          tags?: string[];
          view_count?: number;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          buyer_id: string;
          design_id: string | null;
          portfolio_id: string | null;
          amount: number;
          platform_fee: number;
          creator_payout: number;
          payment_method: 'card' | 'apple_pay' | 'usdc';
          payment_network: string | null;
          transaction_hash: string | null;
          stripe_payment_id: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          design_id?: string | null;
          portfolio_id?: string | null;
          amount: number;
          platform_fee: number;
          creator_payout: number;
          payment_method: 'card' | 'apple_pay' | 'usdc';
          payment_network?: string | null;
          transaction_hash?: string | null;
          stripe_payment_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          design_id?: string | null;
          portfolio_id?: string | null;
          amount?: number;
          platform_fee?: number;
          creator_payout?: number;
          payment_method?: 'card' | 'apple_pay' | 'usdc';
          payment_network?: string | null;
          transaction_hash?: string | null;
          stripe_payment_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          company_name: string;
          company_logo_url: string | null;
          location: string | null;
          job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'gig';
          experience_level: 'junior' | 'mid' | 'senior' | 'lead' | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          skills_required: string[];
          application_url: string | null;
          is_remote: boolean;
          is_featured: boolean;
          status: 'active' | 'closed' | 'draft';
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          company_name: string;
          company_logo_url?: string | null;
          location?: string | null;
          job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'gig';
          experience_level?: 'junior' | 'mid' | 'senior' | 'lead' | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          skills_required?: string[];
          application_url?: string | null;
          is_remote?: boolean;
          is_featured?: boolean;
          status?: 'active' | 'closed' | 'draft';
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string;
          company_name?: string;
          company_logo_url?: string | null;
          location?: string | null;
          job_type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'gig';
          experience_level?: 'junior' | 'mid' | 'senior' | 'lead' | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          skills_required?: string[];
          application_url?: string | null;
          is_remote?: boolean;
          is_featured?: boolean;
          status?: 'active' | 'closed' | 'draft';
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          design_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          design_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          design_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
  };
}
