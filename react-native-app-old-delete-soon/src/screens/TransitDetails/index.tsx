import React, { useState, useRef } from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useTheme } from '@shopify/restyle'
import Box from 'components/Box'
import Button from 'components/Button'
import { ThumbsUp, ThumbsDown } from 'components/Icons'
import Input from 'components/Input'
import Text from 'components/Text'
import { DrawerNavigatorParams } from 'navigators/MainNavigator'
import { Theme } from 'theme/restyle'
import ChatMessage from './components/ChatMessage'
import TransitGrid from './components/TransitGrid'
import { Message } from './utils'

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
  const route = useRoute<RouteProp<DrawerNavigatorParams, 'TransitList'>>()

  const { conversationId } = route.params

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

  const renderChat = () => (
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
          <Button icon="UP_ARROW" onPress={() => console.log(inputText)} />
        </Box>
      </Box>
    </SafeAreaView>
  )

  return (
    <Box mt="m">
      <Box m="m">
        <TransitGrid />
      </Box>
      {/* {renderChat()} */}
    </Box>
  )
}

export default ChatScreen
