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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_path: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_path?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      posters: {
        Row: {
          id: string;
          category_id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          image_path: string;
          is_active: boolean;
          is_best_selling?: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          image_path: string;
          is_active?: boolean;
          is_best_selling?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_path?: string;
          is_active?: boolean;
          is_best_selling?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posters_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      poster_variants: {
        Row: {
          id: string;
          poster_id: string;
          variant_name: string;
          size_code: string;
          dimensions: string;
          price: number;
          inclusions: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          poster_id: string;
          variant_name: string;
          size_code: string;
          dimensions: string;
          price: number;
          inclusions?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          poster_id?: string;
          variant_name?: string;
          size_code?: string;
          dimensions?: string;
          price?: number;
          inclusions?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "poster_variants_poster_id_fkey";
            columns: ["poster_id"];
            isOneToOne: false;
            referencedRelation: "posters";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type PosterRow = Database["public"]["Tables"]["posters"]["Row"];
export type AdminUserRow = Database["public"]["Tables"]["admin_users"]["Row"];
export type PosterVariantRow = Database["public"]["Tables"]["poster_variants"]["Row"];

export interface PosterWithCategory extends PosterRow {
  category?: CategoryRow;
  variants?: PosterVariantRow[];
}
