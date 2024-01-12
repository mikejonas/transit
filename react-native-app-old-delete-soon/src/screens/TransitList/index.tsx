import React, { useState, useRef, useEffect } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import { ArrowUp } from 'components/Icons'
import Input from 'components/Input'
import Text from 'components/Text'
import { DrawerNavigatorParams, MainNavigatorProps } from 'navigators/MainNavigator'
import { Theme } from 'theme/restyle'
import ChatMessage from './components/ChatMessage'
import QuestionsList from './components/QuestionsList'
import TransitCategories from './components/TransitCategories'

/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatScreen: React.FC = () => {
  const theme = useTheme<Theme>()
  const [inputText, setInputText] = useState('')
  const [hasDataInitialized, setHasDataInitialized] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const flatListRef = useRef<FlatList>(null)
  const route = useRoute<RouteProp<DrawerNavigatorParams, 'TransitList'>>()
  const navigation = useNavigation<MainNavigatorProps>()

  const { conversationId } = route.params

  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(false)
    }

    fetchData()
  }, [])

  const postMessage = async (newMessage: string) => {}

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
          <Text>Loading...</Text>
        </Box>
      )}
      <Box mt="l">
        <TransitCategories />
      </Box>
      <Box mt="l">
        <QuestionsList
          onPress={() => {
            navigation.navigate('TransitHoroscope')
          }}
        />
      </Box>
      <FlatList
        ref={flatListRef}
        data={[]}
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
            <Button onPress={() => postMessage(inputText)}>
              <ArrowUp color="#fff" size={20} />
            </Button>
          </Box>
        </Box>
      </SafeAreaView>
    </Box>
  )
}

export default ChatScreen
