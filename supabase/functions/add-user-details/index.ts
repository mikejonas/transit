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

    const { data: { user } } = await supabase.auth.getUser()
    if(!user) throw new Error("User not found");

    const body = await req.json();
    const date = new Date(body.birth_date)
    
    const birthDate = date.toISOString().slice(0,10);
    const birthTime = date.toISOString().slice(11,19);


    // TODO: Support more columns
    const userDatails: UserDetails = {
      user_id: user.id,
      name: body.name,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_location: {
        latitude: 0,
        longitude: 0,
      },
    };

    const added = await user_details_db.AddUserDetails(userDatails);
    if (added) {
      return SuccessfulResponse(JSON.stringify(userDatails));
    } else {
      return ErrorResponse("Failure to add user details for unknown reason.");
    }
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
