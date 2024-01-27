import React, { forwardRef, useState } from 'react'
import { Keyboard, TextInput } from 'react-native'
import Box from 'components/Box'
import Text from 'components/Text'
import Button from 'components/Button'
import Input from 'components/Input'

interface MessageInputProps {
  editable: boolean
  placeholder: string
  onPressIn?: () => void
  onSubmit?: (question: string) => void
  onChangeText?: (text: string) => void
}

const MessageInput = forwardRef<TextInput, MessageInputProps>(
  ({ editable, onChangeText, placeholder, onPressIn, onSubmit }, ref) => {
    const [inputText, setInputText] = useState('')

    return (
      <Box flexDirection="row" alignItems="center" marginHorizontal="m">
        <Box flex={1}>
          <Input
            ref={ref}
            editable={editable}
            value={inputText}
            onChangeText={text => {
              setInputText(text)
              onChangeText && onChangeText(text)
            }}
            onPressIn={onPressIn}
            placeholder={placeholder}
            returnKeyType={'done'}
            onSubmitEditing={() => {
              if (inputText) {
                onSubmit?.(inputText)
                setInputText('')
              }
            }}
          />
        </Box>
      </Box>
    )
  },
)

export default MessageInput
