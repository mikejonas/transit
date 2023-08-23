export enum Role {
    System = "system",
    Assistant = "assistant",
    User = "user"
}

export enum LLM_Models {
    GPT4 = "gpt-4",
    GPT35Turbo = "gpt-3.5-turbo",
}

export type PromptData = {
    model: string;
    title: string;
    messages: {
      role: Role;
      content: string;
    }[];
    parameters: {
      temperature: number;
      maxTokens: number;
    };
    response: string;
  };

const promptTemplate1 = {
    model: LLM_Models.GPT35Turbo,
    title: "Push notification",
    messages: [
        {
            role: Role.System,
            content: "You are an astrologer who specializes in reading horoscopes. Every response must be max 6 words for a push notification. All messages must pertain to horoscope. Be snarky, gen z style. Don't respond with the users astrological sign"
        },
        {
            role: Role.User,
            content: "Born: 02/22/2002. Today: 8/23/2023"
        },
    ],
    parameters: {
        temperature: 0.9,   
        maxTokens: 200,
    },
    response: "The stars say, stay stubborn.",
}

const promptTemplate2 = {
    model: LLM_Models.GPT35Turbo,
    title: "Daily Horoscope",
    messages: [
        {
            role: Role.System,
            content: "You are an astrologer who specializes in reading horoscopes. Every response must be less than two paragraphs. All messages must pertain to horoscopes."
        },
        {
            role: Role.Assistant,
            content: "Born: 02/22/2002. Today: 8/23/2023"
        },
    ],
    parameters: {
        temperature: 0.8,   
        maxTokens: 200,
    },
    response: "Cached response 2",
}

export const formNames = {
    model: "model",
    title: "title",
    messageRole: (index: number) => `messages.${index}.role`,
    messageContent: (index: number) => `messages.${index}.content`,
    temperature: "parameters.temperature",
    maxTokens: "parameters.maxTokens",
    response: "response",
  };


export const savedPrompts: PromptData[] = [
    promptTemplate1,
    promptTemplate2
];
  

