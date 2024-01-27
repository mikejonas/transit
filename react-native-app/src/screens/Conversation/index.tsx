import React, { useRef, useMemo, useEffect, useState } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import CustomHeader from './CustomHeader' // Import your custom header
import TransitDetails from 'screens/TransitDetails'

import Suggestions from './Suggestions'

import BottomSheet from '@gorhom/bottom-sheet'
import { useNavigation, useRoute } from '@react-navigation/native' // Import useNavigation
import MessageInput from '../../components/MessageInput'
import { HomeNavigationProps, ConversationThreadRouteProps } from 'navigators/HomeNavigator'

import { useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet'
import Box from 'components/Box'
const App = () => {
  const [animationDuration, setAnimationDuration] = useState(0)
  const [inputText, setInputText] = useState('')

  const navigation = useNavigation<HomeNavigationProps>()
  const route = useRoute<ConversationThreadRouteProps>()
  const sheetRef = useRef<BottomSheet>(null)
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    setAnimationDuration(250)
    if (inputRef.current && !route.params?.conversationId) {
      inputRef.current.focus()
    }
  }, [])

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: animationDuration,
  })

  const snapPoints = useMemo(() => ['40%', '100%'], [])

  const renderAskNewQuestion = () => {
    return (
      <>
        <CustomHeader title={'New chat'} onBackPress={() => navigation.goBack()} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 68 : 0}>
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
            {inputText.length === 0 && <Suggestions />}
            <Box pt="xs" style={{ backgroundColor: '#181818' }}>
              <MessageInput
                ref={inputRef}
                editable={true}
                onChangeText={text => setInputText(text)}
                onSubmit={question => {
                  navigation.navigate('ConversationThread', { conversationId: 3, title: question })
                }}
                placeholder="Ask anything..."
              />
            </Box>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </>
    )
  }

  const renderConversationThread = () => {
    return (
      <>
        <CustomHeader onBackPress={() => navigation.goBack()} title={'Sun, Jun 4th'} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 68 : 0}>
          <SafeAreaView style={{ flex: 1 }}>
            <TransitDetails />
            <Box pt="xs" style={{ backgroundColor: '#181818' }}>
              <MessageInput ref={inputRef} editable={true} placeholder="Ask follow up..." />
            </Box>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </>
    )
  }

  const { conversationId } = route.params

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <BottomSheet
          animationConfigs={animationConfigs}
          backgroundStyle={styles.bottomSheetStyle}
          ref={sheetRef}
          snapPoints={snapPoints}
          index={1}
          onChange={index => {}}
          onAnimate={(fromIndex, toIndex) => {
            if (toIndex === 0 || toIndex - 1) {
              navigation.goBack()
            }
          }}
          handleComponent={CustomHandle}>
          {(conversationId || 0) > 2 ? renderConversationThread() : renderAskNewQuestion()}
        </BottomSheet>
      </View>
    </SafeAreaProvider>
  )
}

export default App

// Custom Handle
const CustomHandle = () => (
  <View style={styles.handleContainer}>
    <View style={styles.handleBar} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {},
  bottomSheetStyle: {
    backgroundColor: '#1a1a1a',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#555',
  },
})
