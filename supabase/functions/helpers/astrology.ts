enum ObjectType {
  MOON,
  SUN,
}

type ZodiacSign =
  | "Aquarius"
  | "Pisces"
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn";

interface Location {
  latitude: number;
  longitude: number;
}

function GetHorizonsUrl(
  location: Location,
  date: string, // Format: YYYY-MM-DD
  time: string, // Format: HH:MM:SS
  object_type: ObjectType,
): string {
  type QueryParams = {
    [key: string]: string | number | boolean;
  };

  const object_id_map: { [key in ObjectType]: number } = {
    [ObjectType.MOON]: 310,
    [ObjectType.SUN]: 10,
  };

  const object_id = object_id_map[object_type];

  const params: QueryParams = {
    format: "json",
    CSV_FORMAT: "'YES'",
    // 1 gets us the R.A.
    quantities: "'1'",
    // This is the birth location. Example: -114.00800,+46.86170,0
    SITE_COORD: `'${location.latitude},${location.longitude},0'`,
    // This is the birth time. Example: 1994-12-09 06:58
    TLIST: `'${date} ${time}'`,
    // This ths the object type. Example: 301 for the moon.
    COMMAND: `'${object_id}'`,
  };

  const base_url = "https://ssd.jpl.nasa.gov";
  const url_path = "/api/horizons.api";
  const url = new URL(url_path, base_url);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value.toString());
  }
  return url.toString();
}

type HorizonData = {
  result: string;
  signature: {
    version: string;
    source: string;
  };
};

function ExtractRA(data: HorizonData): string {
  const lines = data.result.split("\n");
  const startMarker = "$$SOE";
  const endMarker = "$$EOE";

  let isDataSection = false;

  for (let line of lines) {
    line = line.trim();
    if (line === endMarker) {
      isDataSection = false;
    }

    if (isDataSection) {
      // Assuming the format is always "Date , , , RA , DEC ," we split by "," and get the RA value.
      const parts = line.split(",");
      if (parts.length >= 4) {
        return parts[3].trim(); // Returns the R.A._(ICRF)
      }
    }

    if (line === startMarker) {
      isDataSection = true;
    }
  }

  throw new Error("Could not extract the R.A.");
}

async function FetchObjectRa(
  location: Location,
  date: string, // Format: YYYY-MM-DD
  time: string, // Format: HH:MM:SS
  object_type: ObjectType,
): Promise<string> {
  const url = GetHorizonsUrl(location, date, time, object_type);
  console.log(url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to reach URL: " + url);
  }
  const horizon_data: HorizonData = await response.json();
  const object_ra = ExtractRA(horizon_data);
  return object_ra;
}

async function GetObjectZodiacSign(
  location: Location,
  date: string, // Format: YYYY-MM-DD
  time: string, // Format: HH:MM:SS
  object_type: ObjectType,
): Promise<ZodiacSign> {
  const ra = await FetchObjectRa(location, date, time, object_type);

  const [hours, minutes, seconds] = ra.split(" ").map((value) =>
    parseFloat(value)
  );

  if (
    hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60 || seconds < 0 ||
    seconds >= 60
  ) {
    throw new Error("Invalid RA format");
  }

  const totalHours = hours + minutes / 60 + seconds / 3600;

  if (totalHours < 2) return "Aries";
  if (totalHours < 4) return "Taurus";
  if (totalHours < 6) return "Gemini";
  if (totalHours < 8) return "Cancer";
  if (totalHours < 10) return "Leo";
  if (totalHours < 12) return "Virgo";
  if (totalHours < 14) return "Libra";
  if (totalHours < 16) return "Scorpio";
  if (totalHours < 18) return "Sagittarius";
  if (totalHours < 20) return "Capricorn";
  if (totalHours < 22) return "Aquarius";
  return "Pisces";
}

// Birthday in GMT.
// const date = new Date("Thursday, December 8, 1994 6:57:00 PM");
// const location: Location = { latitude: -114.00800, longitude: 46.86170 };
// const object_type = ObjectType.SUN;
// console.log(await GetObjectZodiacSign(location, date, object_type));

export { GetObjectZodiacSign, ObjectType };
export type { ZodiacSign };
