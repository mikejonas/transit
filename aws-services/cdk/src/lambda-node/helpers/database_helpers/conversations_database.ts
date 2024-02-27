import { SupabaseClient } from "@supabase/supabase-js";

interface Conversation {
  conversation_id: number;
  user_id: string;
}

class ConversationsDatabase {
  supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  public async NewConversation(user_id: string): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from("Conversations")
      .insert([
        {
          user_id: user_id,
        },
      ])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    if (data.length !== 1) {
      throw new Error("Unable to start new conversation. Unexpected data.");
    }
    const conversation: Conversation = {
      conversation_id: data[0].conversation_id,
      user_id: data[0].user_id,
    };
    return conversation;
  }

  public async GetConversation(conversation_id: number): Promise<Conversation> {
    const { data, error } = await this.supabase
      .from("Conversations")
      .select()
      .eq("conversation_id", conversation_id);
    if (error) {
      throw new Error(error.message);
    }
    if (data.length !== 1) {
      throw new Error("Found an unexpected number of conversations.");
    }
    const conversation: Conversation = {
      conversation_id: data[0].conversation,
      user_id: data[0].user_id,
    };
    return conversation;
  }

  public async DoesConversationExist(
    conversation_id: number
  ): Promise<boolean> {
    try {
      await this.GetConversation(conversation_id);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}

export { ConversationsDatabase };
export type { Conversation };
