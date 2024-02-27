import { SupabaseClient } from "@supabase/supabase-js";
import {
  AstrologicalReport,
  DateTimeAndLocation,
  GenerateAstrologicalReport,
  ObjectType,
  ZodiacSign,
} from "../astrology";
import { UserDetails } from "./user_details_database";

// Represents a row in the "Astrological Details" table.
interface AstrologicalDetail {
  astrological_details_id: number;
  // Will be null if this is a "system report".
  user_id: string;
  astrological_report: AstrologicalReport;
  // If true, this is a "system report"
  system_report: boolean;
}

class AstrologicalDetailsDatabase {
  supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async AddAstrologicalDetailForUser(
    user_details: UserDetails,
    update = false
  ): Promise<void> {
    console.log("Adding astrological details for user.");
    const date_time_and_location: DateTimeAndLocation = {
      date: user_details.birth_date,
      time: user_details.birth_time,
      latitude: user_details.birth_latitude,
      longitude: user_details.birth_longitude,
    };

    const astrological_report = await GenerateAstrologicalReport(
      date_time_and_location
    );

    console.log("Astrological Report: ", astrological_report);
    if (update) {
      const { error } = await this.supabase
        .from("Astrological Details")
        .update({
          astrological_report: astrological_report,
          system_report: false,
        })
        .eq("user_id", user_details.user_id);
      if (error) {
        console.log("Error: ", error);
        throw new Error(error.message);
      }
    } else {
      const { error } = await this.supabase
        .from("Astrological Details")
        .insert({
          user_id: user_details.user_id,
          astrological_report: astrological_report,
          system_report: false,
        });
      if (error) {
        console.log("Error: ", error);
        throw new Error(error.message);
      }
    }
  }

  // Just keeping this method around for the time being to not have to adjust where it is called from.
  public async GetZodiacSign(
    user_id: string,
    object_type: ObjectType
  ): Promise<ZodiacSign> {
    const { data, error } = await this.supabase
      .from("Astrological Details")
      .select()
      .eq("user_id", user_id)
      .limit(1)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    const astrological_report: AstrologicalReport = data.astrological_report;
    for (const object_report of astrological_report.object_reports) {
      if (object_report.object_type === object_type) {
        return object_report.sign;
      }
    }
    throw new Error(
      "Could not find the object type in the astrological report."
    );
  }

  public async GetAstrologicalDetailForUser(
    user_id: string
  ): Promise<AstrologicalDetail> {
    const { data, error } = await this.supabase
      .from("Astrological Details")
      .select()
      .eq("user_id", user_id)
      .limit(1)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    const astrological_detail: AstrologicalDetail = {
      astrological_details_id: data.astrological_details_id,
      user_id: data.user_id,
      astrological_report: data.astrological_report,
      system_report: data.system_report,
    };
    return astrological_detail;
  }

  public async GetAstrologicalDetailsForToday(): Promise<AstrologicalDetail> {
    const most_recent_astrological_detail =
      await this.GetAstrologicalDetailForSystem();
    if (
      most_recent_astrological_detail.astrological_report.date_time_and_location
        .date === new Date().toISOString().split("T")[0]
    ) {
      return most_recent_astrological_detail;
    }
    const date_time_and_location: DateTimeAndLocation = {
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      latitude: 0,
      longitude: 0,
    };
    await this.AddAstrologicalDetailForSystem(date_time_and_location);
    return await this.GetAstrologicalDetailForSystem();
  }

  public async GetAstrologicalDetailForSystem(): Promise<AstrologicalDetail> {
    const { data, error } = await this.supabase
      .from("Astrological Details")
      .select()
      .eq("system_report", true)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    const astrological_detail: AstrologicalDetail = {
      astrological_details_id: data.astrological_details_id,
      user_id: data.user_id,
      astrological_report: data.astrological_report,
      system_report: data.system_report,
    };
    return astrological_detail;
  }

  public async AddAstrologicalDetailForSystem(
    date_time_and_location: DateTimeAndLocation
  ): Promise<void> {
    const astrological_report = await GenerateAstrologicalReport(
      date_time_and_location
    );
    console.log("Astrological Report: ", astrological_report);
    const { error } = await this.supabase.from("Astrological Details").insert({
      astrological_report: astrological_report,
      system_report: true,
    });

    if (error) {
      console.log("Error: ", error);
      throw new Error(error.message);
    }
  }
}

export { AstrologicalDetailsDatabase };
export type { AstrologicalDetail };
