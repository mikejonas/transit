import React, { useState, useRef, useEffect } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { InteractionManager } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import { ThumbsUp, ThumbsDown } from 'components/Icons'
import Input from 'components/Input'
import Text from 'components/Text'
import { DrawerNavigatorParams } from 'navigators/MainNavigator'
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
  const route = useRoute<RouteProp<DrawerNavigatorParams, 'DailyHoroscope'>>()

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

  const renderGrid = () => {
    return (
      <Box borderWidth={1} borderColor="lightBorder">
        {/* First Row: Title */}
        <Box
          px="l"
          py="m"
          alignItems="center"
          justifyContent="center"
          borderBottomWidth={1}
          borderColor="lightBorder">
          <Text>Is career affecting my relationships?</Text>
        </Box>

        {/* Second Row: Two columns */}
        <Box flexDirection="row" borderBottomWidth={1} borderColor="lightBorder">
          {/* Left Column: Image */}
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            borderRightWidth={1}
            borderColor="lightBorder"
            p="m">
            <Box width={50} height={50} backgroundColor="text" />
          </Box>
          {/* Right Column: Text */}
          <Box flex={1} alignItems="center" justifyContent="center">
            <Box p="m">
              <Text>Transitioning Venus sesquiquadrate natal sun in capricorn</Text>
            </Box>
          </Box>
        </Box>

        {/* Third Row: Body */}
        <Box p="m">
          <Text lineHeight={25}>
            There is indeed tension between your career and personal relationships right now. This
            aspect can amplify your ambition and work-related pursuits, governed by Capricorn's
            natural inclination for discipline and structure. However, Venus, the planet of
            relationships, is at a challenging angle, potentially causing strain as you try to
            balance your professional life with your personal connections. It may be a time to be
            cautious and considerate in both spheres to navigate through this period successfully.
          </Text>
        </Box>
        {/* Last Row: Thumbs up/down and Share */}
        <Box
          flexDirection="row"
          justifyContent="flex-end"
          p="m"
          borderTopWidth={1}
          borderColor="lightBorder">
          <Box flexDirection="row">
            <Box mr="s">
              <ThumbsUp size={18} color="#fff" />
            </Box>
            <Box>
              <ThumbsDown size={18} color="#fff" />
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="background">
      <Box m="l">{renderGrid()}</Box>
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
