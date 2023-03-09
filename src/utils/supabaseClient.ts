import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import environmentVariables from "./config";

const supabase=createClient<Database>(environmentVariables.supabaseUrl, environmentVariables.supabaseKey);

export default supabase;
