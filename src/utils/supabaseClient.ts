import { createClient } from "@supabase/supabase-js";
import environmentVariables from "./config";

const supabase=createClient(environmentVariables.supabaseUrl, environmentVariables.supabaseKey);

export default supabase;
