import { SupabaseClient } from "SupabaseClient";
import { UserDetailsDatabase } from "./user_details.ts";
import { ChatCompletionMessage, OpenAI } from "OpenAi";
import { GetSunSign } from "./astrology.ts";

interface Message {
  conversation_id: number;
  user_id: string;
  message_id: number;
  role: string;
  content: string;
}

class Conversation {
  supabase: SupabaseClient;
  user_details_db: UserDetailsDatabase;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.user_details_db = new UserDetailsDatabase(supabase);
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
    const message = await this.GetFirstMessage(conversation_id, user_id);
    return message;
  }

  public async AddMessage(
    conversation_id: number,
    new_message: string,
  ): Promise<Message> {
    if (!await this.DoMessagesExist(conversation_id)) {
      throw new Error(
        "You must first start a comversation.",
      );
    }
    this.InsertMessae(conversation_id, "user", new_message);
    // Loading the conversation will return the newly added message.
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
      // TODO: Sort out how to make this happy.
      messages: openai_messages,
    });
    const assistant_response = completion.choices[0].message.content!;
    const first_message = await this.InsertMessae(
      conversation_id,
      "assistant",
      assistant_response,
    );
    return first_message;
  }

  private async GetConversation(conversation_id: number): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from("Messages")
      .select()
      .eq("conversation_id", conversation_id);
    if (error) {
      throw new Error(error.message);
    }
    const messages: Message[] = [];
    for (let i = 0; i < data.length; i++) {
      const message: Message = {
        conversation_id: data[0].conversation_id,
        user_id: data[0].user_id,
        message_id: data[0].message_id,
        role: data[0].role,
        content: data[0].content,
      };
      messages.push(message);
    }
    return messages;
  }

  private async DoMessagesExist(conversation_id: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("Messages")
      .select()
      .eq("conversation_id", conversation_id);
    if (error) {
      throw new Error(error.message);
    }
    return data.length !== 0;
  }

  private async InsertMessae(
    conversation_id: number,
    role: string,
    content: string,
  ): Promise<Message> {
    const { data, error } = await this.supabase
      .from("Messages")
      .insert([
        {
          conversation_id: conversation_id,
          role: role,
          content: content,
        },
      ])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    const message: Message = {
      conversation_id: data[0].conversation_id,
      user_id: data[0].user_id,
      message_id: data[0].message_id,
      role: data[0].role,
      content: data[0].content,
    };
    return message;
  }

  private async GetFirstMessage(
    conversation_id: number,
    user_id: string,
  ): Promise<Message> {
    if (await this.DoMessagesExist(conversation_id)) {
      throw new Error("Messages already exits. Cannot get first message.");
    }
    const user_details = await this.user_details_db.GetUserDetails(user_id);

    const user_prompt = "In one paragraph, tell me what my horoscope is on " +
      new Date().toDateString() + " given that my sign is " +
      GetSunSign(user_details) + ".";
    const system_message = await this.InsertMessae(
      conversation_id,
      "system",
      "You are an astrologer who specializes in reading horoscopes.",
    );
    const user_message = await this.InsertMessae(
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
    const first_message = await this.InsertMessae(
      conversation_id,
      "assistant",
      assistant_response,
    );
    return first_message;
  }
}

export { Conversation };
export type { Message };
