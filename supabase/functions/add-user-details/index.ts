import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import {
  UserDetails,
  UserDetailsDatabase,
} from "../helpers/user_details.ts";

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });
    const user_details_db = new UserDetailsDatabase(supabase);
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
    const added = await user_details_db.AddUserDetails(user_details);
    if (added) {
      return SuccessfulResponse("Succesfully added user details.");
    } else {
      return ErrorResponse("Failure to add user details for unknown reason.");
    }
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
