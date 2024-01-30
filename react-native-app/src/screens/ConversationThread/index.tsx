import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Box from 'components/Box'
import Text from 'components/Text'
import AssistantResponse from './components/AssistantResponse'
import { requests } from 'requests'
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  ConversationThreadNavigationProps,
  ConversationThreadRouteProps,
} from 'navigators/HomeNavigator'
import MessageInput from 'components/MessageInput'
import { Keyboard, ScrollView, TextInput } from 'react-native'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const useGetConversationMessages = (conversationId?: number) => {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => {
      if (typeof conversationId === 'number') {
        return requests.generated.getMessages({ conversationId })
      }
      throw new Error('Invalid conversationId: Must be a number.')
    },
    enabled: !!conversationId,
  })
}

const useStartNewConversation = () => {
  const navigation = useNavigation<ConversationThreadNavigationProps>()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requests.edgeFunctions.startNewConversation,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] })
      navigation.setParams({
        conversationId: data.data.conversation_id,
        newThreadFirstMessage: undefined,
      })
    },
    onError: error => {
      // Handle error
    },
  })
}

const useAddMessageInConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requests.edgeFunctions.addMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation'] })
    },
  })
}

const ConversationThread: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null)
  const inputRef = useRef<TextInput>(null)
  const route = useRoute<ConversationThreadRouteProps>()
  const { conversationId, newThreadFirstMessage } = route.params
  const query = useGetConversationMessages(conversationId)
  const addMessageMutation = useAddMessageInConversation()
  const newConversationMutation = useStartNewConversation()
  const isResponsePending = addMessageMutation.isPending || newConversationMutation.isPending

  useEffect(() => {
    if (newThreadFirstMessage && !conversationId) {
      newConversationMutation.mutate({ newMessage: newThreadFirstMessage })
    }
  }, [])

  useLayoutEffect(() => {
    if (addMessageMutation.isPending) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 200)
    }
  }, [addMessageMutation.isPending])

  useEffect(() => {
    if (query && query.isSuccess && !query.isFetching) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 200)
    }
  }, [query?.data, query?.isFetching]) // Dependency on query.data

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    })

    return () => keyboardDidShowListener.remove()
  }, [])

  //TODO - use a better key then message!
  const renderUserMessage = (message: string, message_id: string) => (
    <Box mx="l" mb="l" key={message_id}>
      <Text fontSize={26} lineHeight={34}>
        {message}
      </Text>
    </Box>
  )

  const renderAssistantMessage = () => {
    if (!Array.isArray(query?.data?.data)) return null
    return query.data.data
      .slice()
      .reverse()
      .map(message => {
        if (message.role === 'user') {
          return renderUserMessage(message.content, message.message_id)
        }
        if (message.role === 'assistant') {
          return (
            <Box mb="xl" key={message.message_id}>
              <AssistantResponse
                assistantMessage={message.content}
                // transit={hasDataInitialized}
                // isInitialLoading={isInitialLoading}
                // conversationId={conversationId}
                // handlePostMessage={postMessage}
              />
            </Box>
          )
        }
      })
  }

  const renderMessageInput = () => {
    return (
      <MessageInput
        onSubmit={question => {
          if (conversationId) {
            addMessageMutation.mutate({ conversationId, newMessage: question })
          }
        }}
        ref={inputRef}
        editable={true}
        placeholder="Ask follow up..."
      />
    )
  }

  return (
    <>
      <BottomSheetScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="always"
        style={{ flex: 1 }}>
        <Box flex={1}>{renderAssistantMessage()}</Box>
        {(addMessageMutation.isPending || newConversationMutation.isPending) &&
          renderUserMessage(
            addMessageMutation.variables?.newMessage || newThreadFirstMessage || '',
            'pending',
          )}
        {isResponsePending && (
          <AssistantResponse assistantMessage={''} isResponsePending={isResponsePending} />
        )}
      </BottomSheetScrollView>
      <Box pt="xs" style={{ backgroundColor: '#181818' }}>
        {renderMessageInput()}
      </Box>
    </>
  )
}

export default ConversationThread
