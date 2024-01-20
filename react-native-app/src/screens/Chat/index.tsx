import React, { useState, useRef, useEffect } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { InteractionManager } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import { MainRouteProps } from 'navigators/MainNavigator'
import { requests } from 'requests'
import { Theme } from 'theme/restyle'
import ChatMessage from './components/ChatMessage'
import {
  // MOCK_ASSISTANT_MESSAGE,
  Message,
  makeTemporaryBotResponse,
  makeUserSubmittedMessage,
  ASSISTANT_ROLE,
} from './utils'

/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatScreen: React.FC = () => {
  const theme = useTheme<Theme>()
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [hasDataInitialized, setHasDataInitialized] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const flatListRef = useRef<FlatList>(null)
  const route = useRoute<MainRouteProps>()

  const { conversationId } = route.params
  const startConversation = async () => {
    if (conversationId) {
      const { data } = await requests.edgeFunctions.startConversation({ conversationId })
      setMessages([data] as Message[])
    } else {
      console.error('conversationId is undefined')
    }
  }

  const getMessages = async () => {
    if (!conversationId) return console.error('conversationId is undefined')

    const { data } = await requests.generated.getMessages({ conversationId })
    if (!data || data.length === 0) {
      await startConversation()
    } else {
      setMessages(data.reverse() as Message[])
    }
    setHasDataInitialized(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getMessages()
      setIsInitialLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const postMessage = async (newMessage: string) => {
    if (newMessage === '') return

    const lastMessageId = messages[messages.length - 1].message_id
    const conversationId = messages[0]!.conversation_id

    if (lastMessageId === undefined || conversationId === undefined) {
      console.error('lastMessageId or conversationId is undefined', {
        lastMessageId,
        conversationId,
      })
      return
    }

    setInputText('')
    addUserMessage(makeUserSubmittedMessage(newMessage, lastMessageId + 1))
    addTemporaryResponse()
    try {
      const { data } = await requests.edgeFunctions.addMessage({
        newMessage: newMessage,
        conversationId,
      })
      replaceTemporaryResponseWithBotResponse(data)
    } catch (error: any) {
      // do something with error (error.message)
    }
  }

  const TEMP_MESSAGE_ID = 999999999

  const addTemporaryResponse = () => {
    const tempMessage = makeTemporaryBotResponse(TEMP_MESSAGE_ID)
    setMessages(previousMessages => [...previousMessages, tempMessage])
  }

  const replaceTemporaryResponseWithBotResponse = (botMessage: Message) => {
    setMessages(previousMessages => [
      ...previousMessages.filter(message => message.message_id !== TEMP_MESSAGE_ID),
      botMessage,
    ])
  }

  const addUserMessage = (botMessage: Message) => {
    setMessages(previousMessages => [...previousMessages, botMessage])
  }

  const scrollToBottom = () => {
    const lastMessageIndex = messages.length - 1

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          animated: !hasDataInitialized,
          index: lastMessageIndex,
        })
      }, 100)
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
      {isInitialLoading && (
        <Box marginBottom="m" padding="m">
          <ChatMessage messageRole={ASSISTANT_ROLE} />
        </Box>
      )}
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
            <Input
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message here"
            />
          </Box>
          <Box marginLeft="s">
            <Button icon="UP_ARROW" onPress={() => postMessage(inputText)} />
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  )
}

export default ChatScreen
