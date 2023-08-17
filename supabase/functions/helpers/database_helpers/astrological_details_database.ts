import { SupabaseClient } from "SupabaseClient";
import {
  FetchObjectRa,
  GetObjectZodiacSign,
  ObjectType,
  ObjectTypeMap,
  ZodiacSign,
} from "../astrology.ts";
import { UserDetails } from "./user_details_database.ts";

interface AstrologicalDetail {
  astrological_details_id: number;
  user_id: string;
  sign_name: string;
  sign: ZodiacSign;
  hours: number;
  minutes: number;
}

class AstrologicalDetailsDatabase {
  supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async AddAstrologicalDetailsForUser(
    user_details: UserDetails,
  ): Promise<void> {
    console.log("Adding astrological details for user.");
    const to_insert: {
      user_id: string;
      sign_name: string;
      sign: ZodiacSign;
      hours: number;
      minutes: number;
    }[] = [];
    for (const object_type of ObjectTypeMap.keys()) {
      // TODO: This is going to be slow because we call them in series.
      const ra = await FetchObjectRa(user_details, object_type);
      const sign = GetObjectZodiacSign(ra);
      to_insert.push({
        user_id: user_details.user_id,
        sign_name: object_type,
        sign: sign,
        hours: ra.hours,
        minutes: ra.minutes,
      });
    }

    console.log("Inserting: ", to_insert);
    const { error } = await this.supabase
      .from("Astrological Details")
      .insert(to_insert);

    if (error) {
      console.log("Error: ", error);
      throw new Error(error.message);
    }
  }

  public async GetZodiacSign(
    user_id: string,
    object_type: ObjectType,
  ): Promise<ZodiacSign> {
    const { data, error } = await this.supabase
      .from("Astrological Details")
      .select()
      .eq("user_id", user_id)
      .eq("sign_name", object_type);
    if (error) {
      throw new Error(error.message);
    }
    if (data.length !== 1) {
      throw new Error("Too many rows for this object type and user id combo.");
    }
    return data[0].sign;
  }

  public async GetAstrologicalDetailsForUser(
    user_id: string,
  ): Promise<AstrologicalDetail[]> {
    const astrological_details: AstrologicalDetail[] = [];
    const { data, error } = await this.supabase
      .from("Astrological Details")
      .select()
      .eq("user_id", user_id);
    if (error) {
      throw new Error(error.message);
    }
    if (data.length === 0) {
      throw new Error("No data for this user.");
    }
    for (const row of data) {
      astrological_details.push({
        astrological_details_id: row.astrological_details_id,
        user_id: row.user_id,
        sign_name: row.sign_name,
        sign: row.sign,
        hours: row.hours,
        minutes: row.minutes,
      });
    }
    return astrological_details;
  }
}

export { AstrologicalDetailsDatabase };
export type { AstrologicalDetail };
