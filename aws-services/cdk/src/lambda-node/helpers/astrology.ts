interface DateTimeAndLocation {
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM:SS
  latitude: number;
  longitude: number;
}

type ObjectType =
  | "Moon"
  | "Sun"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

const ObjectTypeMap: Map<ObjectType, number> = new Map([
  ["Moon", 310],
  ["Sun", 10],
  ["Mercury", 199],
  ["Venus", 299],
  ["Mars", 499],
  ["Jupiter", 599],
  ["Saturn", 699],
  ["Uranus", 799],
  ["Neptune", 899],
  ["Pluto", 999],
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
  date_time_and_location: DateTimeAndLocation,
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
      `'${date_time_and_location.latitude},${date_time_and_location.longitude},0'`,
    // This is the birth time. Example: 1994-12-09 06:58
    // BIG TODO: Right now we do not handle time zones correctly. We assume the time zone is UT.
    TLIST: `'${date_time_and_location.date} ${date_time_and_location.time}'`,
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
  date_time_and_location: DateTimeAndLocation,
  object_type: ObjectType,
): Promise<RA> {
  const url = GetHorizonsUrl(date_time_and_location, object_type);
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

async function IsObjectInRetrograde(
  date_time_and_location: DateTimeAndLocation,
  object_type: ObjectType,
): Promise<boolean> {
  // We might need to adjust this value for slower moving objects.
  const days_apart = 5;
  const ra_1 = await FetchObjectRa(date_time_and_location, object_type);
  const birthDate = new Date(date_time_and_location.date);
  birthDate.setDate(birthDate.getDate() - days_apart);
  const second_date_time_and_location: DateTimeAndLocation = {
    date: birthDate.toISOString().split("T")[0],
    time: date_time_and_location.time,
    latitude: date_time_and_location.latitude,
    longitude: date_time_and_location.longitude,
  };

  // Fetch the RA of the object for the new date
  const ra_2 = await FetchObjectRa(second_date_time_and_location, object_type);

  // Calculate the difference in RA between the two dates
  const ra_diff = (ra_1.hours + ra_1.minutes / 60 + ra_1.seconds / 3600) -
    (ra_2.hours + ra_2.minutes / 60 + ra_2.seconds / 3600);

  // If the difference is negative, the object is in retrograde motion
  return ra_diff < 0;
}

interface ObjectReport {
  object_type: ObjectType;
  sign: ZodiacSign;
  is_in_retrograde: boolean;
  ra: RA;
}

interface AstrologicalReport {
  date_time_and_location: DateTimeAndLocation;
  object_reports: ObjectReport[];
}

async function GenerateAstrologicalReport(
  date_time_and_location: DateTimeAndLocation,
) {
  const object_reports: ObjectReport[] = [];
  for (const object_type of ObjectTypeMap.keys()) {
    const ra = await FetchObjectRa(date_time_and_location, object_type);
    const sign = GetObjectZodiacSign(ra);
    let is_in_retrograde = false;
    if (object_type !== "Moon" && object_type !== "Sun") {
      is_in_retrograde = await IsObjectInRetrograde(
        date_time_and_location,
        object_type,
      );
    }
    object_reports.push({
      object_type: object_type,
      sign: sign,
      is_in_retrograde: is_in_retrograde,
      ra: ra,
    });
  }
  const astrological_report: AstrologicalReport = {
    date_time_and_location: date_time_and_location,
    object_reports: object_reports,
  };
  return astrological_report;
}

export {
  FetchObjectRa,
  GenerateAstrologicalReport,
  GetObjectZodiacSign,
  IsObjectInRetrograde,
  ObjectTypeMap,
};
export type {
  AstrologicalReport,
  DateTimeAndLocation,
  ObjectReport,
  ObjectType,
  ZodiacSign,
};
