import { SupabaseClient } from "SupabaseClient";

export type RoleType = "user" | "system" | "assistant";

interface Message {
  conversation_id: number;
  user_id: string;
  message_id: number;
  role: RoleType;
  content: string;
}

class MessagesDatabase {
  supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  // Returns a list of messages in the order from oldest to newest.
  public async GetAllMessagesInConversation(
    conversation_id: number,
  ): Promise<Message[]> {
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
        conversation_id: data[i].conversation_id,
        user_id: data[i].user_id,
        message_id: data[i].message_id,
        role: data[i].role,
        content: data[i].content,
      };
      messages.push(message);
    }
    return messages;
  }

  // Checks to see if any messages exist for the current conversation id.
  public async DoMessagesExist(conversation_id: number): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("Messages")
      .select()
      .eq("conversation_id", conversation_id);
    if (error) {
      throw new Error(error.message);
    }
    return data.length !== 0;
  }

  // Adds a message to the Messages Db.
  public async AddMessage(
    user_id: string,
    conversation_id: number,
    role: RoleType,
    content: string,
  ): Promise<Message> {
    const { data, error } = await this.supabase
      .from("Messages")
      .insert([
        {
          user_id: user_id,
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
}

export { MessagesDatabase };
export type { Message };
