import React, { useState, useRef, useEffect } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { InteractionManager } from 'react-native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import { Theme } from 'theme/restyle'
import supabase from 'utils/supabaseClient'
import ChatMessage from './components/ChatMessage'
import { MOCK_ASSISTANT_MESSAGE, Message, makeUserSubmittedMessage } from './utils'

/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatScreen: React.FC = () => {
  const theme = useTheme<Theme>()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [hasDataInitialized, setHasDataInitialized] = useState(false)
  const flatListRef = useRef<FlatList>(null)

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
    setHasDataInitialized(true)
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const postMessage = async (newMessage: string) => {
    // TODO don't allow empty messages
    if (newMessage === '') return
    setMessage('')
    // TODO fix this, it should not be an if statement
    if (messages[0].conversation_id) {
      addUserMessage(
        makeUserSubmittedMessage(newMessage, messages[messages.length - 1].message_id + 1),
      )
    }

    const { data, error } = await supabase.functions.invoke('add-message', {
      body: JSON.stringify({
        new_message: newMessage,
        conversation_id: messages[0].conversation_id,
      }),
    })
    if (error) throw error
    addBotResponse(data)
  }

  const addBotResponse = (botMessage: Message) => {
    setMessages(previousMessages => [...previousMessages, botMessage])
  }

  const addUserMessage = (botMessage: Message) => {
    setMessages(previousMessages => [...previousMessages, botMessage])
  }

  const scrollToBottom = () => {
    const lastMessageIndex = messages.length - 1

    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToIndex({
        animated: !hasDataInitialized,
        index: lastMessageIndex,
      })
    })
  }

  const onScrollToIndexFailed = (info: { index: number }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 100))
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.index, animated: !hasDataInitialized })
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
            <ChatMessage messageRole={item.role} messageContent={item.content} />
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
