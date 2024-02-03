// Import necessary modules from Deno
const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY") as string;

export async function placeAutocomplete(searchQuery: string) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Google Places API key is missing in environment variables",
    );
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  );
  url.searchParams.append("input", searchQuery);
  url.searchParams.append("types", "(cities)");
  url.searchParams.append("key", GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("status: ", data.status);
    return data;
  } catch (error) {
    console.error("Error fetching place autocomplete:", error);
    throw error; // Rethrow the error for handling by the caller
  }
}

export async function getCityCoordinates(placeId: string) {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error(
      "Google Places API key is missing in environment variables",
    );
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  url.searchParams.append("place_id", placeId);
  url.searchParams.append("fields", "geometry"); // Can also get the formatted_address here if needed
  url.searchParams.append("key", GOOGLE_PLACES_API_KEY);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status !== "OK") {
      throw new Error(`API error! status: ${data.status}`);
    }

    const { lat, lng } = data.result.geometry.location;
    console.log("City coordinates:", { lat, lng });
    return { lat, lng };
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    throw error; // Rethrow the error for handling by the caller
  }
}
