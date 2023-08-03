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

    const body = await req.json();
    const conversation_id = body.conversation_id;

    const conversations = new Conversations(supabase);
    const message = await conversations.StartConversation(conversation_id, user.id);

    return SuccessfulResponse(JSON.stringify(message));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
