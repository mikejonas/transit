import { SupabaseClient } from "SupabaseClient";
import { UserDetailsDatabase } from "./database_helpers/user_details_database.ts";
import {
  Message,
  MessagesDatabase,
} from "./database_helpers/messages_database.ts";
import { OpenAI } from "OpenAi";
import { ObjectType, GetObjectZodiacSign, ZodiacSign } from "./astrology.ts";
import {
  Conversation,
  ConversationsDatabase,
} from "./database_helpers/conversations_database.ts";

const SYSTEM_MESSAGE =
  "You are an astrologer who specializes in reading horoscopes. Every response must be less than two paragraphs. All messages must pertain to horoscopes.";

class ConversationFacilitator {
  supabase: SupabaseClient;
  user_details_db: UserDetailsDatabase;
  messages_database: MessagesDatabase;
  conversation_database: ConversationsDatabase;
  open_ai: OpenAI;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.user_details_db = new UserDetailsDatabase(supabase);
    this.messages_database = new MessagesDatabase(supabase);
    this.conversation_database = new ConversationsDatabase(supabase);
    this.open_ai = new OpenAI(Deno.env.get("OPENAI_API_KEY")!);
  }

  // Inserts a new conversation row into the conversation table. Does not change the messages table.
  public async NewConversation(user_id: string): Promise<Conversation> {
    if (!await this.user_details_db.DoesUserExist(user_id)) {
      throw new Error(
        "Cannot start new conversation for a user that does not exist.",
      );
    }
    return await this.conversation_database.NewConversation(user_id);
  }

  // Returns a single message that is the initial response from the assistant.
  public async StartConversation(
    conversation_id: number,
    user_id: string,
  ): Promise<Message> {
    if (!await this.user_details_db.DoesUserExist(user_id)) {
      throw new Error(
        "Cannot start new conversation for a user that does not exist.",
      );
    }
    if (
      !await this.conversation_database.DoesConversationExist(conversation_id)
    ) {
      throw new Error(
        "Conversation does not exist. You must add a new conversation first.",
      );
    }
    const message = await this.GetFirstResponse(conversation_id, user_id);
    return message;
  }

  // Adds a message to the conversation and then returns the assistants response message that is added into the messages db.
  public async AddMessageToConversation(
    user_id: string,
    conversation_id: number,
    new_message: string,
  ): Promise<Message> {
    if (
      !await this.conversation_database.DoesConversationExist(conversation_id)
    ) {
      throw new Error(
        "Conversation does not exist. You must start a new conversation first.",
      );
    }
    await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "system",
      SYSTEM_MESSAGE,
    );
    await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "user",
      new_message,
    );
    const messages = await this.messages_database.GetAllMessagesInConversation(
      conversation_id,
    );
    const assistant_response = await this.TalkToOpenAi(messages);
    const assistant_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response,
    );
    return assistant_message;
  }

  private async GetFirstResponse(
    conversation_id: number,
    user_id: string,
  ): Promise<Message> {
    if (await this.messages_database.DoMessagesExist(conversation_id)) {
      throw new Error(
        "Messages already exist. You must start a new conversation before calling GetFirstMessage.",
      );
    }
    const user_details = await this.user_details_db.GetUserDetails(user_id);
    const sun_sign: ZodiacSign = await GetObjectZodiacSign(user_details.birth_location, user_details.birth_date, user_details.birth_time, ObjectType.SUN);
    const user_prompt = "In one paragraph, tell me what my horoscope is on " + new Date().toDateString() + " given that my sign is " + sun_sign + ".";
    const system_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "system",
      SYSTEM_MESSAGE,
    );
    const user_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "user",
      user_prompt,
    );
    const assistant_response = await this.TalkToOpenAi([
      system_message,
      user_message,
    ]);
    const first_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response,
    );
    return first_message;
  }

  // Based on the passed in messages get Open AI's response
  private async TalkToOpenAi(messages: Message[]): Promise<string> {
    const open_ai_messages = [];
    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i]);
      open_ai_messages.push({
        role: messages[i].role,
        content: messages[i].content,
      });
    }
    const completion = await this.open_ai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: open_ai_messages,
    });
    const assistant_response = completion.choices[0].message.content!;
    return assistant_response;
  }
}

export { ConversationFacilitator };
