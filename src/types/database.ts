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
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      modules: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          order_index: number;
          icon: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          order_index: number;
          icon: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          order_index?: number;
          icon?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string;
          content_md: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description: string;
          content_md: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          module_id?: string;
          title?: string;
          description?: string;
          content_md?: string;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      exercises: {
        Row: {
          id: string;
          lesson_id: string;
          title: string;
          description: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          title: string;
          description: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          lesson_id?: string;
          title?: string;
          description?: string;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      user_exercise_progress: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_exercise_progress_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
        ];
      };
      practice_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          duration_minutes: number;
          bpm: number | null;
          transition_type: string | null;
          notes: string | null;
          mistakes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          duration_minutes: number;
          bpm?: number | null;
          transition_type?: string | null;
          notes?: string | null;
          mistakes?: string | null;
          created_at?: string;
        };
        Update: {
          date?: string;
          duration_minutes?: number;
          bpm?: number | null;
          transition_type?: string | null;
          notes?: string | null;
          mistakes?: string | null;
        };
        Relationships: [];
      };
      track_analyses: {
        Row: {
          id: string;
          user_id: string;
          track_name: string;
          artist: string;
          bpm: number | null;
          key: string | null;
          genre: string | null;
          structure: string | null;
          sound_design: string | null;
          mixing_notes: string | null;
          what_works: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          track_name: string;
          artist: string;
          bpm?: number | null;
          key?: string | null;
          genre?: string | null;
          structure?: string | null;
          sound_design?: string | null;
          mixing_notes?: string | null;
          what_works?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          track_name?: string;
          artist?: string;
          bpm?: number | null;
          key?: string | null;
          genre?: string | null;
          structure?: string | null;
          sound_design?: string | null;
          mixing_notes?: string | null;
          what_works?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      artist_sound_maps: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          genre_tags: string[];
          signature_sounds: string | null;
          key_tracks: string | null;
          production_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          genre_tags?: string[];
          signature_sounds?: string | null;
          key_tracks?: string | null;
          production_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          genre_tags?: string[];
          signature_sounds?: string | null;
          key_tracks?: string | null;
          production_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
