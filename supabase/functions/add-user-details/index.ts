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
import { getCityCoordinates } from "../helpers/google-places.ts";

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

    const {
      name,
      birth_date: birthDateAndTime,
      birth_location,
      birth_location_place_id,
    } = await req.json();

    const birthDateISO = new Date(birthDateAndTime).toISOString();

    const birthDate = birthDateISO.slice(0, 10);
    const birthTime = birthDateISO.slice(11, 19);

    const birthCoordinates = await getCityCoordinates(birth_location_place_id);
    const user_details: UserDetails = {
      user_id: user.id,
      name: name,
      birth_date: birthDate,
      birth_time: birthTime,
      birth_location: birth_location,
      birth_latitude: birthCoordinates.lat,
      birth_longitude: birthCoordinates.lng,
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
