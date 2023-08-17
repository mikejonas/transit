import { UserDetails } from "./database_helpers/user_details_database.ts";

type ObjectType = "Moon" | "Sun";

const ObjectTypeMap: Map<ObjectType, number> = new Map([
  ["Moon", 310],
  ["Sun", 10],
]);

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

interface RA {
  hours: number;
  minutes: number;
  seconds: number;
}

function GetHorizonsUrl(
  user_details: UserDetails,
  object_type: ObjectType,
): string {
  type QueryParams = {
    [key: string]: string | number | boolean;
  };
  const object_id = ObjectTypeMap.get(object_type);

  const params: QueryParams = {
    format: "json",
    CSV_FORMAT: "'YES'",
    // 1 gets us the R.A.
    quantities: "'1'",
    // This is the birth location. Example: -114.00800,+46.86170,0
    SITE_COORD:
      `'${user_details.birth_latitude},${user_details.birth_longitude},0'`,
    // This is the birth time. Example: 1994-12-09 06:58
    // BIG TODO: Right now we do not handle time zones correctly. We assume the time zone is UT.
    TLIST: `'${user_details.birth_date} ${user_details.birth_time}'`,
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
  user_details: UserDetails,
  object_type: ObjectType,
): Promise<RA> {
  const url = GetHorizonsUrl(user_details, object_type);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to reach URL: " + url);
  }
  const horizon_data: HorizonData = await response.json();
  const object_ra = ExtractRA(horizon_data);
  const [hours, minutes, seconds] = object_ra.split(" ").map((value) =>
    parseFloat(value)
  );
  const ra: RA = { hours, minutes, seconds };
  return ra;
}

function GetObjectZodiacSign(ra: RA): ZodiacSign {
  const hours = ra.hours;
  const minutes = ra.minutes;
  const seconds = ra.seconds;

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

// const location: Location = { latitude: -114.00800, longitude: 46.86170 };
// const object_type = ObjectType.SUN;
// console.log(await GetObjectZodiacSign(location, "1994-12-08", "23:57", object_type));

export { GetObjectZodiacSign, FetchObjectRa, ObjectTypeMap };
export type { ObjectType, ZodiacSign };
