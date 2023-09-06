import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import {
  UserDetails,
  UserDetailsDatabase,
} from "../helpers/database_helpers/user_details_database.ts";
import {
  AstrologicalDetailsDatabase,
} from "../helpers/database_helpers/astrological_details_database.ts";

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

    const body = await req.json();
    const date = new Date(body.birth_date);

    const birth_date = date.toISOString().slice(0, 10);
    const birth_time = date.toISOString().slice(11, 19);

    // TODO: Support more columns
    const user_details: UserDetails = {
      user_id: user.id,
      name: body.name,
      birth_date: birth_date,
      birth_time: birth_time,
      birth_location: "",
      birth_latitude: 0,
      birth_longitude: 0,
    };
    const added = await user_details_db.AddUserDetails(user_details);
    if (added) {
      const astrological_details_db = new AstrologicalDetailsDatabase(supabase);
      await astrological_details_db.AddAstrologicalDetailForUser(user_details);
      return SuccessfulResponse(JSON.stringify(user_details));
    } else {
      return ErrorResponse("Failure to add user details for unknown reason.");
    }
  } catch (error) {
    console.log("Error: ", error);
    return ErrorResponse(error.message);
  }
});
