import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdwchioyzfctztmjzsrm.supabase.co";
const supabaseAnonKey = "sb_publishable_3CV3vTyg5hp5n2niK6oUpQ_BXRBvH55";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);