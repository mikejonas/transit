import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import {
  UserDetails,
  UserDetailsDatabase,
} from "../helpers/user_details.ts";

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  // TODO: Add in row level auth correctly
  const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: req.headers.get("Authorization")! } },
  });
  const user_details_db = new UserDetailsDatabase(supabase);
  try {
    const body = await req.json();
    // TODO: Support more columns
    const user_details: UserDetails = {
      user_id: body.user_id,
      name: body.name,
      birth_date: body.birth_date,
      birth_time: "",
      birth_location: {
        latitude: 0,
        longitude: 0,
      },
    };
    const added = await user_details_db.UpdateUserDetails(user_details);
    if (added) {
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
