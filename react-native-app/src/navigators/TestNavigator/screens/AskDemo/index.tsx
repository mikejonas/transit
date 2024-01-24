import React, { forwardRef, useRef, useState } from 'react'
import { SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TextInput } from 'react-native'
import Box from 'components/Box'
import Text from 'components/Text'
import Button from 'components/Button'
import { ArrowUp } from 'components/Icons'
import Input from 'components/Input'
import { useHeaderHeight } from '@react-navigation/elements'
import CustomBottomSheetModal, { BottomSheetModalMethods } from './BottomSheetModal'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

interface MessageInputProps {
  editable: boolean
  onPressIn?: () => void
}

const MessageInput = forwardRef<TextInput, MessageInputProps>(({ editable, onPressIn }, ref) => {
  const [inputText, setInputText] = useState('')

  return (
    <Box flexDirection="row" alignItems="center" marginHorizontal="m" marginTop="s">
      <Box flex={1}>
        <Input
          ref={ref}
          value={inputText}
          onChangeText={setInputText}
          onPressIn={onPressIn}
          placeholder="ask anything..."
        />
      </Box>
      <Box marginLeft="s">
        <Button onPress={() => console.log('press')}>
          <ArrowUp color="#333" size={20} />
        </Button>
      </Box>
    </Box>
  )
})

const ChatScreen: React.FC = () => {
  const headerHeight = useHeaderHeight()
  const [inputText, setInputText] = useState('')
  const askModalRef = useRef<BottomSheetModalMethods>(null)
  const inputRef = useRef<TextInput>(null)

  const postMessage = async (newMessage: string) => {
    // Your message posting logic here
  }

  const renderSheet = () => {
    return (
      <CustomBottomSheetModal
        ref={askModalRef}
        onChange={index => {
          if (index === 0) {
            inputRef.current?.focus()
          }
        }}
        onAnimate={(from, to) => {
          if (to === -1) {
            Keyboard.dismiss()
            inputRef.current?.blur()
          }
        }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
          <Box mt="l">
            <Text>Hi</Text>
          </Box>
          <Box flex={1} justifyContent="space-between"></Box>
          <MessageInput ref={inputRef} editable={true} />
        </KeyboardAvoidingView>
      </CustomBottomSheetModal>
    )
  }

  return (
    <Box flex={1} backgroundColor="background">
      <SafeAreaView style={{ flex: 1 }}>
        <Box height={400} width={350} backgroundColor="cardSecondaryBackground"></Box>
        <Text>Hi</Text>

        <Box flex={1} justifyContent="space-between">
          <Box />
          <MessageInput
            ref={inputRef}
            editable={true}
            onPressIn={() => {
              askModalRef.current?.present()
              inputRef.current?.focus()
            }}
          />
        </Box>
        {renderSheet()}
      </SafeAreaView>
    </Box>
  )
}

export default ChatScreen
