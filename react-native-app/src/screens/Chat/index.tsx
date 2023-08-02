import React, { useState, useRef, useEffect } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { InteractionManager } from 'react-native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import { Theme } from 'theme/restyle'
import supabase from 'utils/supabaseClient'
import ChatMessage from './ChatMessage'

export interface Message {
  message_id: number
  conversation_id: number
  content: string
  created_at: string
  role: string
  user_id: string
}
/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatScreen: React.FC = () => {
  const theme = useTheme<Theme>()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const flatListRef = useRef<FlatList>(null)
  // has screen loaded with all its data
  const [hasScreenInitialized, setHasScreenInitialized] = useState(false)
  // const [isLoading, sethasScreenInitialized] = useState(false)

  const USER_ROLE = 'user'
  const ASSISTANT_ROLE = 'assistant '

  const DATA = {
    content: 'Yoo',
    conversation_id: 50,
    message_id: 99,
    role: ASSISTANT_ROLE,
    user_id: 'b5cb1809-7ff4-43e7-89eb-164c10df48be',
  }

  const getMessages = async () => {
    const { data, error } = await supabase.from('Messages').select(`
      conversation_id,
      message_id,
      role,
      created_at,
      content,
      user_id
    `)
    if (error) console.error(error)

    setMessages(data as Message[])
    setHasScreenInitialized(true)
  }

  useEffect(() => {
    // get messages on initial load
    getMessages()
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      // scroll to bottom when new message is added
      scrollToBottom()
    }
  }, [messages])

  const postMessage = async (new_message: string) => {
    setMessage('')
    // TODO add this back.
    // const { data, error } = await supabase.functions.invoke('add-message', {
    //   body: JSON.stringify({ new_message, conversation_id: messages[0].conversation_id }),
    // })
    // console.log(data)
    // respond after 1 second
    setTimeout(() => {
      addBotResponse(DATA as Message)
    }, 1000)
  }

  const addBotResponse = (botMessage: Message) => {
    setMessages(previousMessages => [...previousMessages, botMessage])
  }

  const scrollToBottom = () => {
    const lastMessageIndex = messages.length - 1

    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToIndex({
        animated: !hasScreenInitialized,
        index: lastMessageIndex,
      })
    })
  }

  useEffect(() => {
    // Clear typing interval on component unmount
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
      }
    }
  }, [])

  const onScrollToIndexFailed = (info: { index: number }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 100))
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: !hasScreenInitialized })
    })
  }

  return (
    <Box flex={1} backgroundColor="background">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.message_id}
        renderItem={({ item }) => (
          <Box marginBottom="m">
            <ChatMessage message={item} />
          </Box>
        )}
        contentContainerStyle={{ padding: theme.spacing.m }}
        onScrollToIndexFailed={onScrollToIndexFailed}
      />
      <SafeAreaView>
        <Box flexDirection="row" alignItems="center" marginHorizontal="m" marginTop="s">
          <Box flex={1}>
            <Input value={message} onChangeText={setMessage} placeholder="Type your message here" />
          </Box>
          <Box marginLeft="s">
            <Button icon="UP_ARROW" onPress={() => postMessage(message)} />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  )
}

export default ChatScreen
