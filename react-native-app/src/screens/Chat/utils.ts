export interface Message {
  message_id: number
  conversation_id?: number
  content: string
  created_at: string
  role: string
  user_id?: string
}

export const USER_ROLE = 'user'
export const ASSISTANT_ROLE = 'assistant'

export const makeUserSubmittedMessage = (message: string, message_id: number): Message => ({
  content: message,
  created_at: new Date().toISOString(),
  message_id: message_id,
  role: USER_ROLE,
})

export const MOCK_ASSISTANT_MESSAGE: Message = {
  content:
    'In most cases, you should use timestamptz for created_at fields. This is because timestamptz takes time zone into consideration, which can be crucial for applications with users or operations across different time zones. Here',
  created_at: new Date().toISOString(),
  message_id: 99,
  role: ASSISTANT_ROLE,
}
