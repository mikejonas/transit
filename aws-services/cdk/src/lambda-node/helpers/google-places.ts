import {
  Client,
  PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function placeAutocomplete(searchQuery: string) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Google Places API key is missing in environment variables"
    );
  }

  const client = new Client({});
  try {
    const response = await client.placeAutocomplete({
      params: {
        input: searchQuery,
        types: PlaceAutocompleteType.cities,
        key: GOOGLE_PLACES_API_KEY,
      },
      timeout: 1000, // Optional: timeout in milliseconds
    });
    console.log("status: ", response.data.status);
    return response.data;
  } catch (error) {
    console.error("Error fetching place autocomplete:", error);
    throw error;
  }
}

export async function getCityCoordinates(placeId: string) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Google Places API key is missing in environment variables"
    );
  }

  const client = new Client({});
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        fields: ["geometry"],
        key: GOOGLE_PLACES_API_KEY,
      },
      timeout: 1000, // Optional: timeout in milliseconds
    });

    if (response.data.status !== "OK") {
      throw new Error(`API error! status: ${response.data.status}`);
    }

    if (response.data.result.geometry) {
      const { lat, lng } = response.data.result.geometry.location;
      console.log("City coordinates:", { lat, lng });
      return { lat, lng };
    } else {
      throw new Error("Coordiantes information is missing");
    }
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    throw error;
  }
}
