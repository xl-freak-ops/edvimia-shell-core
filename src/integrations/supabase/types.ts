export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      academic_sessions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean
          name: string
          school_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name: string
          school_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name?: string
          school_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_sessions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_audit: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["attendance_status"] | null
          note: string | null
          old_status: Database["public"]["Enums"]["attendance_status"] | null
          record_id: string
          school_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["attendance_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["attendance_status"] | null
          record_id: string
          school_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["attendance_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["attendance_status"] | null
          record_id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_audit_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "attendance_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_audit_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          arm_id: string | null
          class_id: string | null
          created_at: string
          date: string
          edited_at: string | null
          edited_by: string | null
          id: string
          is_finalized: boolean
          marked_at: string
          marked_by: string | null
          remark: string | null
          school_id: string
          session_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          subject_id: string | null
          term_id: string | null
          updated_at: string
        }
        Insert: {
          arm_id?: string | null
          class_id?: string | null
          created_at?: string
          date: string
          edited_at?: string | null
          edited_by?: string | null
          id?: string
          is_finalized?: boolean
          marked_at?: string
          marked_by?: string | null
          remark?: string | null
          school_id: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          subject_id?: string | null
          term_id?: string | null
          updated_at?: string
        }
        Update: {
          arm_id?: string | null
          class_id?: string | null
          created_at?: string
          date?: string
          edited_at?: string | null
          edited_by?: string | null
          id?: string
          is_finalized?: boolean
          marked_at?: string
          marked_by?: string | null
          remark?: string | null
          school_id?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          subject_id?: string | null
          term_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_arm_id_fkey"
            columns: ["arm_id"]
            isOneToOne: false
            referencedRelation: "class_arms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      class_arms: {
        Row: {
          class_id: string
          created_at: string
          id: string
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_arms_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_arms_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          school_id: string
          section_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          school_id: string
          section_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          school_id?: string
          section_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      grade_scales: {
        Row: {
          created_at: string
          display_order: number
          grade: string
          id: string
          max_score: number
          min_score: number
          remark: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          grade: string
          id?: string
          max_score: number
          min_score: number
          remark?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          grade?: string
          id?: string
          max_score?: number
          min_score?: number
          remark?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "grade_scales_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_settings: {
        Row: {
          attendance: Json
          created_at: string
          email: Json
          promotion: Json
          results: Json
          school_id: string
          sms: Json
          updated_at: string
        }
        Insert: {
          attendance?: Json
          created_at?: string
          email?: Json
          promotion?: Json
          results?: Json
          school_id: string
          sms?: Json
          updated_at?: string
        }
        Update: {
          attendance?: Json
          created_at?: string
          email?: Json
          promotion?: Json
          results?: Json
          school_id?: string
          sms?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_settings_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: true
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          administrator_name: string | null
          closing_date: string | null
          country: string
          cover_url: string | null
          created_at: string
          currency: string | null
          email: string | null
          id: string
          lga: string | null
          logo_url: string | null
          motto: string | null
          name: string
          phone: string | null
          primary_color: string | null
          principal_name: string | null
          resumption_date: string | null
          school_time_end: string | null
          school_time_start: string | null
          school_type: string
          secondary_color: string | null
          state: string | null
          timezone: string | null
          updated_at: string
          vice_principal_name: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          administrator_name?: string | null
          closing_date?: string | null
          country: string
          cover_url?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          lga?: string | null
          logo_url?: string | null
          motto?: string | null
          name: string
          phone?: string | null
          primary_color?: string | null
          principal_name?: string | null
          resumption_date?: string | null
          school_time_end?: string | null
          school_time_start?: string | null
          school_type: string
          secondary_color?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          vice_principal_name?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          administrator_name?: string | null
          closing_date?: string | null
          country?: string
          cover_url?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          lga?: string | null
          logo_url?: string | null
          motto?: string | null
          name?: string
          phone?: string | null
          primary_color?: string | null
          principal_name?: string | null
          resumption_date?: string | null
          school_time_end?: string | null
          school_time_start?: string | null
          school_type?: string
          secondary_color?: string | null
          state?: string | null
          timezone?: string | null
          updated_at?: string
          vice_principal_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employment_date: string | null
          full_name: string
          gender: Database["public"]["Enums"]["staff_gender"] | null
          id: string
          is_teaching: boolean
          metadata: Json
          phone: string | null
          photo_url: string | null
          position: Database["public"]["Enums"]["staff_position"]
          qualification: string | null
          salary: number | null
          school_id: string
          specialization: string | null
          staff_code: string
          status: Database["public"]["Enums"]["staff_status"]
          status_changed_at: string | null
          status_note: string | null
          updated_at: string
          user_id: string | null
          username: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_date?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["staff_gender"] | null
          id?: string
          is_teaching?: boolean
          metadata?: Json
          phone?: string | null
          photo_url?: string | null
          position?: Database["public"]["Enums"]["staff_position"]
          qualification?: string | null
          salary?: number | null
          school_id: string
          specialization?: string | null
          staff_code: string
          status?: Database["public"]["Enums"]["staff_status"]
          status_changed_at?: string | null
          status_note?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_date?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["staff_gender"] | null
          id?: string
          is_teaching?: boolean
          metadata?: Json
          phone?: string | null
          photo_url?: string | null
          position?: Database["public"]["Enums"]["staff_position"]
          qualification?: string | null
          salary?: number | null
          school_id?: string
          specialization?: string | null
          staff_code?: string
          status?: Database["public"]["Enums"]["staff_status"]
          status_changed_at?: string | null
          status_note?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          assignment_type: string
          class_arm_id: string | null
          class_id: string | null
          club_name: string | null
          created_at: string
          department: string | null
          id: string
          school_id: string
          session_id: string | null
          staff_id: string
          subject_id: string | null
          updated_at: string
        }
        Insert: {
          assignment_type: string
          class_arm_id?: string | null
          class_id?: string | null
          club_name?: string | null
          created_at?: string
          department?: string | null
          id?: string
          school_id: string
          session_id?: string | null
          staff_id: string
          subject_id?: string | null
          updated_at?: string
        }
        Update: {
          assignment_type?: string
          class_arm_id?: string | null
          class_id?: string | null
          club_name?: string | null
          created_at?: string
          department?: string | null
          id?: string
          school_id?: string
          session_id?: string | null
          staff_id?: string
          subject_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_class_arm_id_fkey"
            columns: ["class_arm_id"]
            isOneToOne: false
            referencedRelation: "class_arms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_attendance: {
        Row: {
          attendance_date: string
          check_in: string | null
          check_out: string | null
          created_at: string
          id: string
          note: string | null
          school_id: string
          staff_id: string
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
        }
        Insert: {
          attendance_date: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          note?: string | null
          school_id: string
          staff_id: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Update: {
          attendance_date?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          note?: string | null
          school_id?: string
          staff_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_attendance_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_documents: {
        Row: {
          created_at: string
          file_path: string
          id: string
          kind: string | null
          mime_type: string | null
          school_id: string
          size_bytes: number | null
          staff_id: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          kind?: string | null
          mime_type?: string | null
          school_id: string
          size_bytes?: number | null
          staff_id: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          kind?: string | null
          mime_type?: string | null
          school_id?: string
          size_bytes?: number | null
          staff_id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_documents_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_documents_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_leave_requests: {
        Row: {
          created_at: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_id: string
          staff_id: string
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_id: string
          staff_id: string
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_id?: string
          staff_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_leave_requests_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_leave_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      student_documents: {
        Row: {
          content_type: string | null
          created_at: string
          doc_type: string
          id: string
          name: string
          school_id: string
          size_bytes: number | null
          storage_path: string
          student_id: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          doc_type: string
          id?: string
          name: string
          school_id: string
          size_bytes?: number | null
          storage_path: string
          student_id: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          doc_type?: string
          id?: string
          name?: string
          school_id?: string
          size_bytes?: number | null
          storage_path?: string
          student_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_guardians: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_emergency: boolean
          is_primary: boolean
          occupation: string | null
          phone: string | null
          relationship: string
          school_id: string
          student_id: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_emergency?: boolean
          is_primary?: boolean
          occupation?: string | null
          phone?: string | null
          relationship: string
          school_id: string
          student_id: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_emergency?: boolean
          is_primary?: boolean
          occupation?: string | null
          phone?: string | null
          relationship?: string
          school_id?: string
          student_id?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_guardians_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_status_history: {
        Row: {
          action: string
          created_at: string
          from_class_id: string | null
          from_status: Database["public"]["Enums"]["student_status"] | null
          id: string
          note: string | null
          performed_by: string | null
          school_id: string
          student_id: string
          to_class_id: string | null
          to_status: Database["public"]["Enums"]["student_status"] | null
        }
        Insert: {
          action: string
          created_at?: string
          from_class_id?: string | null
          from_status?: Database["public"]["Enums"]["student_status"] | null
          id?: string
          note?: string | null
          performed_by?: string | null
          school_id: string
          student_id: string
          to_class_id?: string | null
          to_status?: Database["public"]["Enums"]["student_status"] | null
        }
        Update: {
          action?: string
          created_at?: string
          from_class_id?: string | null
          from_status?: Database["public"]["Enums"]["student_status"] | null
          id?: string
          note?: string | null
          performed_by?: string | null
          school_id?: string
          student_id?: string
          to_class_id?: string | null
          to_status?: Database["public"]["Enums"]["student_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "student_status_history_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_status_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string
          admission_number: string
          arm_id: string | null
          blood_group: string | null
          class_id: string | null
          created_at: string
          created_by: string | null
          date_of_birth: string | null
          disabilities: string | null
          first_name: string
          gender: Database["public"]["Enums"]["student_gender"]
          genotype: string | null
          home_address: string | null
          hostel: string | null
          house: string | null
          id: string
          lga: string | null
          medical_conditions: string | null
          middle_name: string | null
          nationality: string | null
          photo_url: string | null
          previous_school: string | null
          religion: string | null
          school_id: string
          state_of_origin: string | null
          status: Database["public"]["Enums"]["student_status"]
          status_changed_at: string | null
          status_note: string | null
          student_code: string
          surname: string
          transport_route: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admission_date?: string
          admission_number: string
          arm_id?: string | null
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          disabilities?: string | null
          first_name: string
          gender: Database["public"]["Enums"]["student_gender"]
          genotype?: string | null
          home_address?: string | null
          hostel?: string | null
          house?: string | null
          id?: string
          lga?: string | null
          medical_conditions?: string | null
          middle_name?: string | null
          nationality?: string | null
          photo_url?: string | null
          previous_school?: string | null
          religion?: string | null
          school_id: string
          state_of_origin?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          status_changed_at?: string | null
          status_note?: string | null
          student_code: string
          surname: string
          transport_route?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admission_date?: string
          admission_number?: string
          arm_id?: string | null
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          date_of_birth?: string | null
          disabilities?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["student_gender"]
          genotype?: string | null
          home_address?: string | null
          hostel?: string | null
          house?: string | null
          id?: string
          lga?: string | null
          medical_conditions?: string | null
          middle_name?: string | null
          nationality?: string | null
          photo_url?: string | null
          previous_school?: string | null
          religion?: string | null
          school_id?: string
          state_of_origin?: string | null
          status?: Database["public"]["Enums"]["student_status"]
          status_changed_at?: string | null
          status_note?: string | null
          student_code?: string
          surname?: string
          transport_route?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_arm_id_fkey"
            columns: ["arm_id"]
            isOneToOne: false
            referencedRelation: "class_arms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          category: Database["public"]["Enums"]["subject_category"]
          code: string | null
          created_at: string
          department: string | null
          id: string
          is_active: boolean
          name: string
          school_id: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["subject_category"]
          code?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          name: string
          school_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["subject_category"]
          code?: string | null
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean
          name?: string
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          is_current: boolean
          name: string
          school_id: string
          session_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name: string
          school_id: string
          session_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          name?: string
          school_id?: string
          session_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_periods: {
        Row: {
          arm_id: string | null
          class_id: string | null
          color: string | null
          created_at: string
          created_by: string | null
          day_of_week: number
          end_time: string
          id: string
          kind: Database["public"]["Enums"]["period_kind"]
          note: string | null
          period_index: number
          room: string | null
          school_id: string
          session_id: string | null
          start_time: string
          subject_id: string | null
          teacher_id: string | null
          term_id: string | null
          updated_at: string
        }
        Insert: {
          arm_id?: string | null
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week: number
          end_time: string
          id?: string
          kind?: Database["public"]["Enums"]["period_kind"]
          note?: string | null
          period_index: number
          room?: string | null
          school_id: string
          session_id?: string | null
          start_time: string
          subject_id?: string | null
          teacher_id?: string | null
          term_id?: string | null
          updated_at?: string
        }
        Update: {
          arm_id?: string | null
          class_id?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          kind?: Database["public"]["Enums"]["period_kind"]
          note?: string | null
          period_index?: number
          room?: string | null
          school_id?: string
          session_id?: string | null
          start_time?: string
          subject_id?: string | null
          teacher_id?: string | null
          term_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_periods_arm_id_fkey"
            columns: ["arm_id"]
            isOneToOne: false
            referencedRelation: "class_arms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_periods_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_versions: {
        Row: {
          arm_id: string | null
          class_id: string | null
          created_at: string
          created_by: string | null
          id: string
          label: string | null
          school_id: string
          session_id: string | null
          snapshot: Json
          term_id: string | null
        }
        Insert: {
          arm_id?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string | null
          school_id: string
          session_id?: string | null
          snapshot: Json
          term_id?: string | null
        }
        Update: {
          arm_id?: string | null
          class_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          label?: string | null
          school_id?: string
          session_id?: string | null
          snapshot?: Json
          term_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_versions_arm_id_fkey"
            columns: ["arm_id"]
            isOneToOne: false
            referencedRelation: "class_arms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_versions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_versions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_versions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "academic_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_versions_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_school_workspace: {
        Args: {
          _address?: string
          _country?: string
          _email?: string
          _name: string
          _phone?: string
          _school_type?: string
          _state?: string
        }
        Returns: string
      }
      ensure_my_workspace: { Args: { _school_name?: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_school_admin_of: { Args: { _school_id: string }; Returns: boolean }
      is_school_member: { Args: { _school_id: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "school_admin"
        | "principal"
        | "vice_principal"
        | "form_teacher"
        | "subject_teacher"
        | "parent"
        | "student"
      attendance_status:
        | "present"
        | "absent"
        | "late"
        | "excused"
        | "remote"
        | "medical"
        | "half_day"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      period_kind: "class" | "break" | "lunch" | "assembly" | "free"
      staff_gender: "male" | "female" | "other"
      staff_position:
        | "principal"
        | "vice_principal"
        | "school_admin"
        | "form_teacher"
        | "subject_teacher"
        | "account_officer"
        | "receptionist"
        | "librarian"
        | "bursar"
        | "other"
      staff_status:
        | "active"
        | "on_leave"
        | "suspended"
        | "terminated"
        | "archived"
      student_gender: "male" | "female" | "other"
      student_status:
        | "active"
        | "graduated"
        | "transferred"
        | "suspended"
        | "withdrawn"
        | "archived"
      subject_category: "core" | "elective" | "practical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "school_admin",
        "principal",
        "vice_principal",
        "form_teacher",
        "subject_teacher",
        "parent",
        "student",
      ],
      attendance_status: [
        "present",
        "absent",
        "late",
        "excused",
        "remote",
        "medical",
        "half_day",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      period_kind: ["class", "break", "lunch", "assembly", "free"],
      staff_gender: ["male", "female", "other"],
      staff_position: [
        "principal",
        "vice_principal",
        "school_admin",
        "form_teacher",
        "subject_teacher",
        "account_officer",
        "receptionist",
        "librarian",
        "bursar",
        "other",
      ],
      staff_status: [
        "active",
        "on_leave",
        "suspended",
        "terminated",
        "archived",
      ],
      student_gender: ["male", "female", "other"],
      student_status: [
        "active",
        "graduated",
        "transferred",
        "suspended",
        "withdrawn",
        "archived",
      ],
      subject_category: ["core", "elective", "practical"],
    },
  },
} as const
