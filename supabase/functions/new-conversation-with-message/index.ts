import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import { ConversationFacilitator } from "../helpers/conversation_facilitator.ts";

// Create a new conversation from an initial user message
serve(async (req) => {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not found");

    const body = await req.json();

    const conversation_facilitator = new ConversationFacilitator(supabase);
    const conversation = await conversation_facilitator.NewConversation(
      user.id,
    );
    
    const message = await conversation_facilitator.AddMessageToConversation(
      user.id,
      conversation.conversation_id,
      body.new_message,
    );
    return SuccessfulResponse(JSON.stringify(conversation));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
