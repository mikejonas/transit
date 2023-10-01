import { serve } from "Serve";
import { createClient } from "SupabaseClient";
import { ErrorResponse, SuccessfulResponse } from "../helpers/response.ts";
import { ConversationFacilitator } from "../helpers/conversation_facilitator.ts";

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
    const question_category = body.question_category;
    const question_content = body.question_content;

    const conversation_facilitator = new ConversationFacilitator(supabase);
    const question_response = await conversation_facilitator.AskQuestion(
      user.id,
      question_category,
      question_content,
    );

    return SuccessfulResponse(JSON.stringify(question_response));
  } catch (error) {
    return ErrorResponse(error.message);
  }
});
