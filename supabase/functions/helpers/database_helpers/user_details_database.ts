import { SupabaseClient } from "SupabaseClient";

interface UserDetails {
  user_id: string;
  name: string;
  birth_date: string; // Format: YYYY-MM-DD
  birth_time: string; // Format: HH:MM:SS
  birth_location: string;
  birth_latitude: number;
  birth_longitude: number;
}

// TODO: Support more columns
class UserDetailsDatabase {
  supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async DoesUserExist(user_id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("User Details")
      .select()
      .eq("user_id", user_id);
    if (error) {
      throw new Error(error.message);
    }
    return data.length !== 0;
  }

  public async AddUserDetails(user_details: UserDetails): Promise<boolean> {
    const { error } = await this.supabase
      .from("User Details")
      .upsert([
        {
          user_id: user_details.user_id,
          name: user_details.name,
          birth_date: user_details.birth_date,
          birth_time: user_details.birth_time,
          birth_location: user_details.birth_location,
          birth_latitude: user_details.birth_latitude,
          birth_longitude: user_details.birth_longitude,
        },
      ]);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  public async UpdateUserDetails(user_details: UserDetails): Promise<boolean> {
    if (!await this.DoesUserExist(user_details.user_id)) {
      throw new Error(
        "User does not exist yet. You must add the user instead.",
      );
    }
    const { error } = await this.supabase
      .from("User Details")
      .update(
        {
          user_id: user_details.user_id,
          name: user_details.name,
          birth_date: user_details.birth_date,
          birth_time: user_details.birth_time,
          birth_location: user_details.birth_location,
          birth_latitude: user_details.birth_latitude,
          birth_longitude: user_details.birth_longitude,
        },
      )
      .eq("user_id", user_details.user_id);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  public async GetUserDetails(user_id: string): Promise<UserDetails> {
    const { data, error } = await this.supabase
      .from("User Details")
      .select()
      .eq("user_id", user_id);
    if (error) {
      throw new Error(error.message);
    }
    if (data.length === 0) {
      throw new Error("This user does not exist.");
    }
    if (data.length > 1) {
      throw new Error("Multiple users with this id.");
    }
    const user_details: UserDetails = {
      user_id: data[0].user_id,
      name: data[0].name,
      birth_date: data[0].birth_date,
      birth_time: "",
      birth_location: "",
      birth_latitude: 0,
      birth_longitude: 0,
    };
    return user_details;
  }
}

export { UserDetailsDatabase };
export type { UserDetails };
