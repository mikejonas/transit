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
    const body = await req.json();
    const user_id = body.user_id;
    const conversation_id = body.conversation_id;
    const new_message = body.new_message;
    const conversation = new Conversations(supabase);
    const message = await conversation.AddMessageToConversation(
      user_id,
      conversation_id,
      new_message,
    );
    return SuccessfulResponse(JSON.stringify(message));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
