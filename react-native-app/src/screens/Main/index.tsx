import React, { useRef, useState, useEffect } from 'react'
import { Animated, PanResponder, Dimensions } from 'react-native'
import { Image, SafeAreaView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Box from 'components/Box'
import SampleQuestionsCarousel from './components/SampleQuestionsCarousel'
import HoroscopeCarousel, { sampleData } from './components/HoroscopeCarousel'
import Text from 'components/Text'
import MessageInput from 'components/MessageInput'
import { HomeNavigationProps } from 'navigators/HomeNavigator'
import { useHeaderHeight } from '@react-navigation/elements'
import FakeNewChatSheet from './components/FakeNewChatSheet'
const screenHeight = Dimensions.get('window').height - 100

const MainScreen: React.FC = () => {
  const headerHeight = useHeaderHeight()
  const inputRef = useRef<TextInput>(null)
  const navigation = useNavigation<HomeNavigationProps>()
  const panY = useRef(new Animated.Value(screenHeight)).current

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  })

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 100
      },
      onPanResponderMove: (_, gestureState) => {
        Animated.timing(panY, {
          toValue: Math.max(gestureState.dy / 1.5, -headerHeight),
          duration: 0,
          useNativeDriver: true,
        }).start()
      },
      onPanResponderRelease: (_, gestureState) => {
        // Your condition and navigation logic
        if (gestureState.dy < -100 || (gestureState.dy < -50 && gestureState.vy < -0.75)) {
          navigation.navigate('ConversationThread', {})
        }
        resetPositionAnim.start()
      },
    }),
  ).current

  const renderDragUpView = () => (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          top: screenHeight,
          height: screenHeight,
          backgroundColor: '#222',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
        { transform: [{ translateY: panY }] },
      ]}
      {...panResponder.panHandlers}>
      <FakeNewChatSheet />
    </Animated.View>
  )

  const renderMessageInput = () => {
    return (
      <MessageInput
        ref={inputRef}
        editable={false}
        placeholder="Ask anything..."
        onPressIn={() => {
          navigation.navigate('ConversationThread', {})
        }}
        onSubmit={question => {
          navigation.navigate('ConversationThread', { newThreadFirstMessage: question })
        }}
      />
    )
  }

  return (
    <Box flex={1} backgroundColor="background" {...panResponder.panHandlers}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1} justifyContent="space-between">
          <Box>{/* (<-- also add mt="xl")<HoroscopeCarousel data={sampleData} /> */}</Box>
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
              onPress={question => {
                navigation.navigate('ConversationThread', { newThreadFirstMessage: question })
              }}
            />
          </Box>
          {renderMessageInput()}
        </Box>
      </SafeAreaView>
      {renderDragUpView()}
    </Box>
  )
}

export default MainScreen
