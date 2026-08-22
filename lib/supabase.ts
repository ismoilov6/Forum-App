import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hdwchioyzfctztmjzsrm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_3CV3vTyg5hp5n2niK6oUpQ_BXRBvH55";

if (!supabaseUrl.startsWith("http")) {
  throw new Error("Invalid supabaseUrl");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);