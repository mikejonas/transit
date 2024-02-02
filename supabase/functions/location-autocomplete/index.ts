import { serve } from "Serve";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";

serve(async (req) => {
  const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Google Places API key is missing in environment variables",
    );
  }

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

    const placesAutocompleteUrl =
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${
        encodeURIComponent(searchQuery)
      }&types=(cities)&key=${GOOGLE_PLACES_API_KEY}`;

    const placesAutocompleteResponse = await fetch(placesAutocompleteUrl);
    const placesData = await placesAutocompleteResponse.json();

    return SuccessfulResponse(JSON.stringify(placesData));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
