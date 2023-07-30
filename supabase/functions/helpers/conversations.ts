import { SupabaseClient } from "SupabaseClient";
import { UserDetailsDatabase } from "./user_details.ts";
import { Message, Messages } from "./messages.ts";
import { OpenAI } from "OpenAi";
import { GetSunSign } from "./astrology.ts";

class Conversations {
  supabase: SupabaseClient;
  user_details_db: UserDetailsDatabase;
  messages_db: Messages;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.user_details_db = new UserDetailsDatabase(supabase);
    this.messages_db = new Messages(supabase);
  }

  public async StartNewConversation(user_id: string): Promise<Message> {
    if (!await this.user_details_db.DoesUserExist(user_id)) {
      throw new Error(
        "Cannot start new conversation for a user that does not exist.",
      );
    }
    const { data, error } = await this.supabase
      .from("Conversations")
      .insert([
        {
          user_id: user_id,
        },
      ]).select();
    if (error) {
      throw new Error(error.message);
    }
    if (data.length !== 1) {
      throw new Error("Unable to start new conversation. Unexpected data.");
    }
    const conversation_id = data[0].conversation_id;
    const message = await this.GetFirstMessage(
      conversation_id,
      user_id,
    );
    return message;
  }

  // Adds a message to the conversation and then returns the assistants response message that is added into the messages db.
  public async AddMessageToConversation(
    user_id: string,
    conversation_id: number,
    new_message: string,
  ): Promise<Message> {
    if (!await this.DoesConversationExist(conversation_id)) {
      throw new Error(
        "Conversation does not exist. You must start a new conversation first.",
      );
    }
    this.messages_db.AddMessage(user_id, conversation_id, "user", new_message);
    const conversation = await this.GetConversation(conversation_id);
    const openai_messages = [];
    for (let i = 0; i < conversation.length; i++) {
      openai_messages.push({
        role: conversation[0].role,
        content: conversation[0].content,
      });
    }
    const openai = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // TODO: Sort out how to make this happy. Code runs just fine.
      messages: openai_messages,
    });
    const assistant_response = completion.choices[0].message.content!;
    const assistant_message = await this.messages_db.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response,
    );
    return assistant_message;
  }

  private async GetFirstMessage(
    conversation_id: number,
    user_id: string,
  ): Promise<Message> {
    if (await this.messages_db.DoMessagesExist(conversation_id)) {
      throw new Error(
        "Messages already exist. You must start a new conversation before calling GetFirstMessage.",
      );
    }
    const user_details = await this.user_details_db.GetUserDetails(user_id);
    const user_prompt = "In one paragraph, tell me what my horoscope is on " +
      new Date().toDateString() + " given that my sign is " +
      GetSunSign(user_details) + ".";
    const system_message = await this.messages_db.AddMessage(
      user_id,
      conversation_id,
      "system",
      "You are an astrologer who specializes in reading horoscopes.",
    );
    const user_message = await this.messages_db.AddMessage(
      user_id,
      conversation_id,
      "user",
      user_prompt,
    );
    const openai = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: system_message.content,
        },
        {
          role: "user",
          content: user_message.content,
        },
      ],
    });
    const assistant_response = completion.choices[0].message.content!;
    const first_message = await this.messages_db.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response,
    );
    return first_message;
  }

  private async DoesConversationExist(
    conversation_id: number,
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("Conversations")
      .select()
      .eq("conversation_id", conversation_id);
    if (error) {
      throw new Error(error.message);
    }
    return data.length !== 0;
  }

  private async GetConversation(conversation_id: number): Promise<Message[]> {
    if (!await this.DoesConversationExist(conversation_id)) {
      throw new Error("Conversation does not exist you must start one first.");
    }
    return this.messages_db.GetAllMessagesInConversation(conversation_id);
  }
}

export { Conversations };
