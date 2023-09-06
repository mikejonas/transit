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
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  // TODO: Add in row level auth correctly
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization")! } },
  });
  const user_details_db = new UserDetailsDatabase(supabase);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  try {
    const body = await req.json();
    // TODO: Support more columns
    const user_details: UserDetails = {
      user_id: user.id,
      name: body.name,
      birth_date: body.birth_date,
      birth_time: "",
      birth_location: "",
      birth_latitude: 0,
      birth_longitude: 0,
    };
    const updated = await user_details_db.UpdateUserDetails(user_details);
    if (updated) {
      const astrological_details_db = new AstrologicalDetailsDatabase(supabase);
      await astrological_details_db.AddAstrologicalDetailForUser(
        user_details,
        /* update= */ true,
      );
      return SuccessfulResponse("Succesfully updated user details.");
    } else {
      return ErrorResponse(
        "Failure to update user details for unknown reason.",
      );
    }
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
