import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import { Conversations } from "../helpers/conversations.ts";

serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: { user } } = await supabase.auth.getUser()
    if(!user) throw new Error("User not found");

    const conversations = new Conversations(supabase);
    const conversation = await conversations.NewConversation(user.id);

    return SuccessfulResponse(JSON.stringify(conversation));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
