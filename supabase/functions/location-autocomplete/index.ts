import { serve } from "Serve";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import { placeAutocomplete } from "../helpers/google-places.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    // I'd prefer this to be a get request, but the supabaseclient doesn't let you use query params for GET requests
    return ErrorResponse(`${req.method} Method not allowed`, 405);
  }

  try {
    const body = await req.json();
    const { searchQuery } = body;

    if (!searchQuery || searchQuery.length < 3) {
      // Requiring at least 3 characters is a reasonable default
      throw new Error("Search query must be at least 3 characters long");
    }

    const predictions = await placeAutocomplete(searchQuery);
    return SuccessfulResponse(JSON.stringify(predictions));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
