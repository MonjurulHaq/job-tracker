import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Application = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: "applied" | "interviewing" | "offer" | "rejected" | "saved";
  job_url?: string;
  job_description?: string;
  notes?: string;
  cover_letter?: string;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  content: string;
  file_name: string;
  created_at: string;
};