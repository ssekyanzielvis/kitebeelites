// Supabase types for southern organization platform
export interface Database {
  public: {
    Tables: {
      charity_visits: {
        Row: {
          id: string;
          title: string;
          location: string;
          visit_date: string;
          status: string;
          objective: string | null;
          activities: string | null;
          estimated_budget_ugx: number | null;
          actual_spent_ugx: number | null;
          impact_summary: string | null;
          main_media_url: string | null;
          main_media_type: string | null;
          funders: any;
          gallery: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location: string;
          visit_date: string;
          status?: string;
          objective?: string | null;
          activities?: string | null;
          estimated_budget_ugx?: number | null;
          actual_spent_ugx?: number | null;
          impact_summary?: string | null;
          main_media_url?: string | null;
          main_media_type?: string | null;
          funders?: any;
          gallery?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          visit_date?: string;
          status?: string;
          objective?: string | null;
          activities?: string | null;
          estimated_budget_ugx?: number | null;
          actual_spent_ugx?: number | null;
          impact_summary?: string | null;
          main_media_url?: string | null;
          main_media_type?: string | null;
          funders?: any;
          gallery?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      why_donate: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          media_url: string | null;
          media_type: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          media_url?: string | null;
          media_type?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          password_hash: string;
          phone_number: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          password_hash: string;
          phone_number?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          password_hash?: string;
          phone_number?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          nationality: string;
          sex: string;
          dob: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          nationality: string;
          sex: string;
          dob: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          nationality?: string;
          sex?: string;
          dob?: string;
          is_approved?: boolean;
          created_at?: string;
        };
      };
      volunteer_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          skills: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          address: string;
          skills: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          skills?: string;
          is_approved?: boolean;
          created_at?: string;
        };
      };
      partner_applications: {
        Row: {
          id: string;
          full_name: string;
          organization_name: string;
          offer: string;
          email: string;
          nationality: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          organization_name: string;
          offer: string;
          email: string;
          nationality: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          organization_name?: string;
          offer?: string;
          email?: string;
          nationality?: string;
          is_approved?: boolean;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      theme_settings: {
        Row: {
          id: string;
          background_color: string;
          text_color: string;
          primary_color: string;
          font_family: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          background_color?: string;
          text_color?: string;
          primary_color?: string;
          font_family?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          background_color?: string;
          text_color?: string;
          primary_color?: string;
          font_family?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      footer_info: {
        Row: {
          id: string;
          organization_name: string | null;
          location: string | null;
          director: string | null;
          email: string | null;
          phone: string | null;
          organization_type: string | null;
          primary_focus: string | null;
          instagram_handle: string | null;
          tiktok_handle: string | null;
          website_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_name?: string | null;
          location?: string | null;
          director?: string | null;
          email?: string | null;
          phone?: string | null;
          organization_type?: string | null;
          primary_focus?: string | null;
          instagram_handle?: string | null;
          tiktok_handle?: string | null;
          website_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_name?: string | null;
          location?: string | null;
          director?: string | null;
          email?: string | null;
          phone?: string | null;
          organization_type?: string | null;
          primary_focus?: string | null;
          instagram_handle?: string | null;
          tiktok_handle?: string | null;
          website_url?: string | null;
          updated_at?: string;
        };
      };
      hello_slides: {
        Row: {
          id: string;
          image_url: string;
          description: string | null;
          order_index: number;
          direction: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          description?: string | null;
          order_index?: number;
          direction?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          description?: string | null;
          order_index?: number;
          direction?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      about_us: {
        Row: {
          id: string;
          image_url: string | null;
          description: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          description: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          description?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      vision: {
        Row: {
          id: string;
          image_url: string | null;
          statement: string;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          statement: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          statement?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      mission: {
        Row: {
          id: string;
          image_url: string | null;
          statement: string;
          is_active: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          statement: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          statement?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      objectives: {
        Row: {
          id: string;
          image_url: string | null;
          statement: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          statement: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          statement?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          description: string;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          description: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          description?: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          description: string;
          achievement_date: string;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          description: string;
          achievement_date: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          description?: string;
          achievement_date?: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      core_values: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          description: string;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          description: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          description?: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      gallery: {
        Row: {
          id: string;
          image_url: string;
          media_type: 'image' | 'video';
          description: string | null;
          category: string | null;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          media_type?: 'image' | 'video';
          description?: string | null;
          category?: string | null;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          media_type?: 'image' | 'video';
          description?: string | null;
          category?: string | null;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          description: string;
          published_date: string;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          description: string;
          published_date: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          description?: string;
          published_date?: string;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      leadership: {
        Row: {
          id: string;
          image_url: string;
          full_name: string;
          title: string;
          achievement: string | null;
          order_index: number;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          full_name: string;
          title: string;
          achievement?: string | null;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          full_name?: string;
          title?: string;
          achievement?: string | null;
          order_index?: number;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string | null;
          gender: string | null;
          residence: string | null;
          message: string | null;
          is_contacted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone_number?: string | null;
          gender?: string | null;
          residence?: string | null;
          message?: string | null;
          is_contacted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          gender?: string | null;
          residence?: string | null;
          message?: string | null;
          is_contacted?: boolean;
          created_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_name: string;
          donor_email: string | null;
          donor_phone: string | null;
          amount: number;
          payment_method: string;
          payment_reference: string | null;
          receipt_number: string | null;
          receipt_generated: boolean;
          receipt_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_name: string;
          donor_email?: string | null;
          donor_phone?: string | null;
          amount: number;
          payment_method: string;
          payment_reference?: string | null;
          receipt_number?: string | null;
          receipt_generated?: boolean;
          receipt_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_name?: string;
          donor_email?: string | null;
          donor_phone?: string | null;
          amount?: number;
          payment_method?: string;
          payment_reference?: string | null;
          receipt_number?: string | null;
          receipt_generated?: boolean;
          receipt_url?: string | null;
          created_at?: string;
        };
      };
      payment_settings: {
        Row: {
          id: string;
          mtn_number: string | null;
          mtn_name: string | null;
          airtel_number: string | null;
          airtel_name: string | null;
          manual_payment_instructions: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mtn_number?: string | null;
          mtn_name?: string | null;
          airtel_number?: string | null;
          airtel_name?: string | null;
          manual_payment_instructions?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mtn_number?: string | null;
          mtn_name?: string | null;
          airtel_number?: string | null;
          airtel_name?: string | null;
          manual_payment_instructions?: string | null;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          page_path: string | null;
          visitor_id: string | null;
          session_id: string | null;
          action_type: string | null;
          visitor_ip: string | null;
          device_type: string | null;
          country: string | null;
          user_agent: string | null;
          referrer: string | null;
          visited_at: string;
        };
        Insert: {
          id?: string;
          page_path?: string | null;
          visitor_id?: string | null;
          session_id?: string | null;
          action_type?: string | null;
          visitor_ip?: string | null;
          device_type?: string | null;
          country?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          visited_at?: string;
        };
        Update: {
          id?: string;
          page_path?: string | null;
          visitor_id?: string | null;
          session_id?: string | null;
          action_type?: string | null;
          visitor_ip?: string | null;
          device_type?: string | null;
          country?: string | null;
          user_agent?: string | null;
          referrer?: string | null;
          visited_at?: string;
        };
      };
      // ── KITEBE ELITES FC — FOOTBALL-SPECIFIC TABLES ──────────────────────
      league_groups: {
        Row: {
          id: string;
          name: string;
          season: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          season: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          season?: string;
          description?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      league_teams: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          short_code: string | null;
          logo_url: string | null;
          captain: string | null;
          home_ground: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          short_code?: string | null;
          logo_url?: string | null;
          captain?: string | null;
          home_ground?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          short_code?: string | null;
          logo_url?: string | null;
          captain?: string | null;
          home_ground?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      league_fixtures: {
        Row: {
          id: string;
          group_id: string;
          home_team_id: string;
          away_team_id: string;
          match_date: string | null;
          match_time: string | null;
          venue: string | null;
          home_score: number | null;
          away_score: number | null;
          status: string;
          match_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          home_team_id: string;
          away_team_id: string;
          match_date?: string | null;
          match_time?: string | null;
          venue?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: string;
          match_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          home_team_id?: string;
          away_team_id?: string;
          match_date?: string | null;
          match_time?: string | null;
          venue?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          status?: string;
          match_notes?: string | null;
          updated_at?: string;
        };
      };
      league_standings: {
        Row: {
          id: string;
          group_id: string;
          team_id: string;
          season: string;
          played: number;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          goal_difference: number; // generated
          points: number;          // generated
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          team_id: string;
          season?: string;
          played?: number;
          won?: number;
          drawn?: number;
          lost?: number;
          goals_for?: number;
          goals_against?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          team_id?: string;
          season?: string;
          played?: number;
          won?: number;
          drawn?: number;
          lost?: number;
          goals_for?: number;
          goals_against?: number;
          updated_at?: string;
        };
      };
      match_gallery: {
        Row: {
          id: string;
          fixture_id: string | null;
          image_url: string;
          caption: string | null;
          media_type: string;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          fixture_id?: string | null;
          image_url: string;
          caption?: string | null;
          media_type?: string;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          fixture_id?: string | null;
          image_url?: string;
          caption?: string | null;
          media_type?: string;
          is_featured?: boolean;
          is_active?: boolean;
        };
      };
      leagues: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          slug: string | null;
          description: string | null;
          sport: string | null;
          competition_type: string | null;
          season: string | null;
          gender: string | null;
          age_category: string | null;
          location: string | null;
          venue: string | null;
          organizer: string | null;
          logo_url: string | null;
          cover_url: string | null;
          status: string | null;
          start_date: string | null;
          end_date: string | null;
          reg_start_date: string | null;
          reg_end_date: string | null;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name?: string | null;
          slug?: string | null;
          description?: string | null;
          sport?: string | null;
          competition_type?: string | null;
          season?: string | null;
          gender?: string | null;
          age_category?: string | null;
          location?: string | null;
          venue?: string | null;
          organizer?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          reg_start_date?: string | null;
          reg_end_date?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string | null;
          slug?: string | null;
          description?: string | null;
          sport?: string | null;
          competition_type?: string | null;
          season?: string | null;
          gender?: string | null;
          age_category?: string | null;
          location?: string | null;
          venue?: string | null;
          organizer?: string | null;
          logo_url?: string | null;
          cover_url?: string | null;
          status?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          reg_start_date?: string | null;
          reg_end_date?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          updated_at?: string;
        };
      };
      league_media: {
        Row: {
          id: string;
          league_id: string | null;
          title: string;
          description: string | null;
          media_url: string;
          media_type: string;
          category: string | null;
          is_featured: boolean;
          is_published: boolean;
          display_order: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          league_id?: string | null;
          title: string;
          description?: string | null;
          media_url: string;
          media_type: string;
          category?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          display_order?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string | null;
          title?: string;
          description?: string | null;
          media_url?: string;
          media_type?: string;
          category?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          display_order?: number | null;
        };
      };
      teams: {
        Row: {
          id: string;
          league_id: string | null;
          name: string;
          logo_url: string | null;
          description: string | null;
          location: string | null;
          manager: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id?: string | null;
          name: string;
          logo_url?: string | null;
          description?: string | null;
          location?: string | null;
          manager?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string | null;
          name?: string;
          logo_url?: string | null;
          description?: string | null;
          location?: string | null;
          manager?: string | null;
          updated_at?: string;
        };
      };
      fixtures: {
        Row: {
          id: string;
          league_id: string | null;
          home_team_id: string | null;
          away_team_id: string | null;
          match_date: string | null;
          venue: string | null;
          status: string | null;
          match_type: string | null;
          home_score: number | null;
          away_score: number | null;
          match_report: string | null;
          highlights_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id?: string | null;
          home_team_id?: string | null;
          away_team_id?: string | null;
          match_date?: string | null;
          venue?: string | null;
          status?: string | null;
          match_type?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          match_report?: string | null;
          highlights_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string | null;
          home_team_id?: string | null;
          away_team_id?: string | null;
          match_date?: string | null;
          venue?: string | null;
          status?: string | null;
          match_type?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          match_report?: string | null;
          highlights_url?: string | null;
          updated_at?: string;
        };
      };
      standings: {
        Row: {
          id: string;
          league_id: string | null;
          team_id: string | null;
          played: number;
          won: number;
          drawn: number;
          lost: number;
          goals_for: number;
          goals_against: number;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id?: string | null;
          team_id?: string | null;
          played?: number;
          won?: number;
          drawn?: number;
          lost?: number;
          goals_for?: number;
          goals_against?: number;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string | null;
          team_id?: string | null;
          played?: number;
          won?: number;
          drawn?: number;
          lost?: number;
          goals_for?: number;
          goals_against?: number;
          points?: number;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          member_number: number | null;
          full_name: string;
          nickname: string | null;
          role: string | null;
          committee: string | null;
          profession: string | null;
          field_of_study: string | null;
          phone: string | null;
          email: string | null;
          image_url: string | null;
          jersey_number: number | null;
          position: string | null;
          is_executive: boolean;
          is_active: boolean;
          joined_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_number?: number | null;
          full_name: string;
          nickname?: string | null;
          role?: string | null;
          committee?: string | null;
          profession?: string | null;
          field_of_study?: string | null;
          phone?: string | null;
          email?: string | null;
          image_url?: string | null;
          jersey_number?: number | null;
          position?: string | null;
          is_executive?: boolean;
          is_active?: boolean;
          joined_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_number?: number | null;
          full_name?: string;
          nickname?: string | null;
          role?: string | null;
          committee?: string | null;
          profession?: string | null;
          field_of_study?: string | null;
          phone?: string | null;
          email?: string | null;
          image_url?: string | null;
          jersey_number?: number | null;
          position?: string | null;
          is_executive?: boolean;
          is_active?: boolean;
          joined_date?: string | null;
          updated_at?: string;
        };
      };
      community_policies: {

        Row: {
          id: string;
          title: string;
          content: string;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      member_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number: string;
          nationality: string;
          gender: string;
          date_of_birth: string;
          why_join: string;
          self_description: string;
          academic_background: string;
          education_level: string;
          additional_info: string | null;
          policies_accepted: boolean;
          status: string;
          rejection_reason: string | null;
          approval_token: string | null;
          profile_completed: boolean;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone_number: string;
          nationality: string;
          gender: string;
          date_of_birth: string;
          why_join: string;
          self_description: string;
          academic_background: string;
          education_level: string;
          additional_info?: string | null;
          policies_accepted?: boolean;
          status?: string;
          rejection_reason?: string | null;
          approval_token?: string | null;
          profile_completed?: boolean;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone_number?: string;
          nationality?: string;
          gender?: string;
          date_of_birth?: string;
          why_join?: string;
          self_description?: string;
          academic_background?: string;
          education_level?: string;
          additional_info?: string | null;
          policies_accepted?: boolean;
          status?: string;
          rejection_reason?: string | null;
          approval_token?: string | null;
          profile_completed?: boolean;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          application_id: string | null;
          full_name: string;
          email: string;
          phone_number: string | null;
          nationality: string | null;
          gender: string | null;
          date_of_birth: string | null;
          why_join: string | null;
          self_description: string | null;
          academic_background: string | null;
          education_level: string | null;
          additional_info: string | null;
          profile_image_url: string | null;
          extra_profile_info: string | null;
          is_active: boolean;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id?: string | null;
          full_name: string;
          email: string;
          phone_number?: string | null;
          nationality?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          why_join?: string | null;
          self_description?: string | null;
          academic_background?: string | null;
          education_level?: string | null;
          additional_info?: string | null;
          profile_image_url?: string | null;
          extra_profile_info?: string | null;
          is_active?: boolean;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string | null;
          full_name?: string;
          email?: string;
          phone_number?: string | null;
          nationality?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          why_join?: string | null;
          self_description?: string | null;
          academic_background?: string | null;
          education_level?: string | null;
          additional_info?: string | null;
          profile_image_url?: string | null;
          extra_profile_info?: string | null;
          is_active?: boolean;
          joined_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}