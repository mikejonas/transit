import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import { UserDetailsDatabase } from "../helpers/database_helpers/user_details_database.ts";

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });
    const user_details_db = new UserDetailsDatabase(supabase);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const user_details = await user_details_db.GetUserDetails(user.id);
    return SuccessfulResponse(JSON.stringify(user_details));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
