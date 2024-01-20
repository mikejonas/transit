import React, { useState } from 'react'
import { Image, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Box from 'components/Box'
import Button from 'components/Button'
import { ArrowUp } from 'components/Icons'
import Input from 'components/Input'
import { MainNavigationProps } from 'navigators/MainNavigator'
import SampleQuestionsCarousel from './components/SampleQuestionsCarousel'
import HoroscopeCarousel, { sampleData } from './components/HoroscopeCarousel'
import Text from 'components/Text'

const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('')
  const navigation = useNavigation<MainNavigationProps>()

  const postMessage = async (newMessage: string) => {}

  const renderMessageInput = () => {
    return (
      <Box flexDirection="row" alignItems="center" marginHorizontal="m" marginTop="s">
        <Box flex={1}>
          <Input value={inputText} onChangeText={setInputText} placeholder="ask anything..." />
        </Box>
        <Box marginLeft="s">
          <Button onPress={() => postMessage(inputText)}>
            <ArrowUp color="#333" size={20} />
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor="background">
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="space-between">
          <Box mt="xl">
            <HoroscopeCarousel data={sampleData} />
          </Box>
          <Box>
            <Box mb="xl">
              <Box mb="m" alignItems="center">
                <Image
                  source={require('../../../assets/logo-white-gradient.png')}
                  style={{ height: 58, width: 58 }}
                />
              </Box>
              <Text variant="header" lineHeight={28} textAlign="center" fontWeight="200">
                converse with the stars
              </Text>
            </Box>
            <SampleQuestionsCarousel
              onPress={() => {
                navigation.navigate('TransitHoroscope', { conversationId: 1 })
              }}
            />
          </Box>
          {renderMessageInput()}
        </Box>
      </SafeAreaView>
    </Box>
  )
}

export default ChatScreen
