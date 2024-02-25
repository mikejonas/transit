import { SupabaseClient } from "@supabase/supabase-js";
import { UserDetailsDatabase } from "./database_helpers/user_details_database";
import {
  Message,
  MessagesDatabase,
  RoleType,
} from "./database_helpers/messages_database";
import { OpenAI } from "openai";
import { ZodiacSign } from "./astrology";
import {
  Conversation,
  ConversationsDatabase,
} from "./database_helpers/conversations_database";
import {
  AstrologicalDetail,
  AstrologicalDetailsDatabase,
} from "../helpers/database_helpers/astrological_details_database";

const SYSTEM_MESSAGE =
  "You are an astrologer who specializes in reading horoscopes. Every response must be less than two paragraphs. All messages must pertain to horoscopes.";
const openAi = new OpenAI(); //todo (do I need api key here?)

class ConversationFacilitator {
  supabase: SupabaseClient;
  user_details_db: UserDetailsDatabase;
  messages_database: MessagesDatabase;
  conversation_database: ConversationsDatabase;
  open_ai: OpenAI;
  astrological_details_db: AstrologicalDetailsDatabase;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.user_details_db = new UserDetailsDatabase(supabase);
    this.messages_database = new MessagesDatabase(supabase);
    this.conversation_database = new ConversationsDatabase(supabase);
    this.open_ai = new OpenAI(); //todo (do I need api key here?)
    this.astrological_details_db = new AstrologicalDetailsDatabase(supabase);
  }

  public async AskQuestion(
    user_id: string,
    question_category: string,
    question_content: string
  ): Promise<Message> {
    console.log(
      "question_category is unused so logging for now: ",
      question_category
    );
    const users_astrological_details: AstrologicalDetail =
      await this.astrological_details_db.GetAstrologicalDetailForUser(user_id);
    // We should an offline process that adds the current astrological report for the day to the database. For now we will just add a new one.
    const system_astrological_details: AstrologicalDetail =
      await this.astrological_details_db.GetAstrologicalDetailsForToday();
    const system_message =
      "You are an astrologer who specializes in reading horoscopes. Every response must be less than two paragraphs. You are speaking to a user with the following birth information: " +
      JSON.stringify(users_astrological_details.astrological_report) +
      ". And the current astrological report for day is: " +
      JSON.stringify(system_astrological_details.astrological_report) +
      ".";
    const conversation = await this.NewConversation(user_id);

    const open_ai_system_message = await this.messages_database.AddMessage(
      user_id,
      conversation.conversation_id,
      "system",
      system_message
    );
    const open_ai_user_message = await this.messages_database.AddMessage(
      user_id,
      conversation.conversation_id,
      "user",
      question_content
    );
    const assistant_response = await this.TalkToOpenAi([
      open_ai_system_message,
      open_ai_user_message,
    ]);
    const first_message = await this.messages_database.AddMessage(
      user_id,
      conversation.conversation_id,
      "assistant",
      assistant_response
    );
    return first_message;
  }

  // Inserts a new conversation row into the conversation table. Does not change the messages table.
  public async NewConversation(user_id: string): Promise<Conversation> {
    if (!(await this.user_details_db.DoesUserExist(user_id))) {
      throw new Error(
        "Cannot start new conversation for a user that does not exist."
      );
    }
    return await this.conversation_database.NewConversation(user_id);
  }

  // Returns a single message that is the initial response from the assistant.
  public async StartConversation(
    conversation_id: number,
    user_id: string
  ): Promise<Message> {
    if (!(await this.user_details_db.DoesUserExist(user_id))) {
      throw new Error(
        "Cannot start new conversation for a user that does not exist."
      );
    }
    if (
      !(await this.conversation_database.DoesConversationExist(conversation_id))
    ) {
      throw new Error(
        "Conversation does not exist. You must add a new conversation first."
      );
    }
    const message = await this.GetFirstResponse(conversation_id, user_id);
    return message;
  }

  // Adds a message to the conversation and then returns the assistants response message that is added into the messages db.
  public async AddMessageToConversation(
    user_id: string,
    conversation_id: number,
    new_message: string
  ): Promise<Message> {
    if (
      !(await this.conversation_database.DoesConversationExist(conversation_id))
    ) {
      throw new Error(
        "Conversation does not exist. You must start a new conversation first."
      );
    }
    await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "system",
      SYSTEM_MESSAGE
    );
    await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "user",
      new_message
    );
    const messages = await this.messages_database.GetAllMessagesInConversation(
      conversation_id
    );
    const assistant_response = await this.TalkToOpenAi(messages);
    const assistant_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response
    );
    return assistant_message;
  }

  private async GetFirstResponse(
    conversation_id: number,
    user_id: string
  ): Promise<Message> {
    if (await this.messages_database.DoMessagesExist(conversation_id)) {
      throw new Error(
        "Messages already exist. You must start a new conversation before calling GetFirstMessage."
      );
    }
    const sun_sign: ZodiacSign =
      await this.astrological_details_db.GetZodiacSign(user_id, "Sun");
    const user_prompt =
      "In one paragraph, tell me what my horoscope is on " +
      new Date().toDateString() +
      " given that my sign is " +
      sun_sign +
      ".";
    const system_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "system",
      SYSTEM_MESSAGE
    );
    const user_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "user",
      user_prompt
    );
    const assistant_response = await this.TalkToOpenAi([
      system_message,
      user_message,
    ]);
    const first_message = await this.messages_database.AddMessage(
      user_id,
      conversation_id,
      "assistant",
      assistant_response
    );
    return first_message;
  }

  // Based on the passed in messages get Open AI's response
  private async TalkToOpenAi(messages: Message[]): Promise<string> {
    const open_ai_messages: { role: RoleType; content: string }[] = [];
    for (let i = 0; i < messages.length; i++) {
      open_ai_messages.push({
        role: messages[i].role,
        content: messages[i].content,
      });
    }

    // Reducing tokens to keep costs down during development!
    // @TODO: Optimise prompt
    const lastFiveMessages = open_ai_messages.slice(-5);
    console.log({ lastFiveMessages });
    const completion = await this.open_ai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: lastFiveMessages
        .map((message) => `${message.role}: ${message.content}`)
        .join("\n"),
    });
    const assistant_response = completion.choices[0].text;
    return assistant_response;
  }
}

export { ConversationFacilitator };
