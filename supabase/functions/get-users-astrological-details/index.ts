import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import {
  AstrologicalDetail,
  AstrologicalDetailsDatabase,
} from "../helpers/database_helpers/astrological_details_database.ts";

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const astrological_details_db = new AstrologicalDetailsDatabase(supabase);
    const astrological_details: AstrologicalDetail =
      await astrological_details_db.GetAstrologicalDetailForUser(user.id);
    return SuccessfulResponse(JSON.stringify(astrological_details));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
