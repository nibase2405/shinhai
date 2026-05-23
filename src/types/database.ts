export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: string;
          status: string;
          notes: string | null;
          login_provider: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          status?: string;
          notes?: string | null;
          login_provider?: string | null;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          status?: string;
          notes?: string | null;
          login_provider?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: string;
          seo_title: string | null;
          seo_description: string | null;
          cover_image: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          type: string;
          seo_title?: string | null;
          seo_description?: string | null;
          cover_image?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          type?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          cover_image?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          category_id: string | null;
          tags: string[] | null;
          author_id: string | null;
          status: string;
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          og_image: string | null;
          schema_faq_json: Json | null;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      attractions: {
        Row: PlaceRow & {
          english_name: string | null;
          opening_hours: string | null;
          ticket_price: string | null;
          transport_info: string | null;
          category: string | null;
          tags: string[] | null;
          is_featured: boolean;
          status: string;
          is_hot: boolean;
          is_map_pinned: boolean;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      restaurants: {
        Row: PlaceRow & {
          phone: string | null;
          opening_hours: string | null;
          average_price: number | null;
          cuisine_type: string | null;
          menu_images: string[] | null;
          is_featured: boolean;
          status: string;
          is_hot: boolean;
          is_map_pinned: boolean;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      hotels: {
        Row: PlaceRow & {
          star_rating: number | null;
          price_range: string | null;
          agoda_url: string | null;
          booking_url: string | null;
          trip_url: string | null;
          klook_stay_url: string | null;
          is_featured: boolean;
          status: string;
          is_hot: boolean;
          is_map_pinned: boolean;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      affiliate_links: {
        Row: {
          id: string;
          title: string;
          provider: string;
          type: string;
          related_type: string | null;
          related_id: string | null;
          url: string;
          original_url: string | null;
          sub_id: string | null;
          commission_note: string | null;
          is_active: boolean;
          click_count: number;
          sort_order: number;
          conversion_note: string | null;
          auto_rule_json: Json;
          external_meta: Json;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      affiliate_clicks: {
        Row: {
          id: string;
          affiliate_link_id: string | null;
          user_id: string | null;
          ip_hash: string | null;
          referrer: string | null;
          user_agent: string | null;
          clicked_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      ads: {
        Row: {
          id: string;
          name: string;
          placement: string;
          size: string;
          ad_type: string;
          adsense_slot: string | null;
          image_url: string | null;
          target_url: string | null;
          is_active: boolean;
          starts_at: string | null;
          ends_at: string | null;
          click_count: number;
          impression_count: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          type: string;
          seo_title: string | null;
          seo_description: string | null;
          cover_image: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      media_assets: {
        Row: {
          id: string;
          url: string;
          alt_text: string | null;
          title: string | null;
          category: string | null;
          mime_type: string | null;
          size_bytes: number | null;
          used_in: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      ad_clicks: {
        Row: {
          id: string;
          ad_id: string | null;
          user_id: string | null;
          ip_hash: string | null;
          referrer: string | null;
          user_agent: string | null;
          clicked_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      merchants: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          merchant_type: string | null;
          address: string | null;
          phone: string | null;
          image_url: string | null;
          cooperation_status: string;
          plan: string | null;
          ad_start_at: string | null;
          ad_end_at: string | null;
          related_type: string | null;
          related_id: string | null;
          is_map_pinned: boolean;
          is_home_featured: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      redirects: {
        Row: {
          id: string;
          source_path: string;
          target_url: string;
          status_code: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          target_type: string | null;
          target_id: string | null;
          user_id: string | null;
          session_id: string | null;
          referrer: string | null;
          user_agent: string | null;
          viewed_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      import_logs: {
        Row: {
          id: string;
          resource_type: string;
          file_name: string | null;
          status: string;
          total_rows: number;
          success_count: number;
          error_count: number;
          error_detail: Json | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          before_data: Json | null;
          after_data: Json | null;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      content_relations: {
        Row: {
          id: string;
          source_type: string;
          source_id: string;
          target_type: string;
          target_id: string;
          relation_type: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      map_markers: {
        Row: {
          id: string;
          target_type: string;
          target_id: string | null;
          name: string;
          category: string | null;
          marker_icon: string | null;
          latitude: number | null;
          longitude: number | null;
          is_visible: boolean;
          is_map_pinned: boolean;
          is_paid_promoted: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          target_type: string;
          target_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: string;
          target_id: string;
          created_at?: string;
        };
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

type PlaceRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  cover_image: string | null;
  gallery: string[] | null;
  rating: number | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};
