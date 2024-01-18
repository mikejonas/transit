// components/Input.js

import React from 'react'
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from 'theme/restyle'
import adjustColorBrightness from 'utils/adjustColorBrightness'

interface InputProps extends RNTextInputProps {}

const Input = ({ ...props }: InputProps) => {
  const theme = useTheme<Theme>()

  const textColor = theme.colors.text
  const placeholderTextColor = adjustColorBrightness(theme.colors.text, -0.25)

  return (
    <>
      <RNTextInput
        {...props}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 16,
          height: 54,
          width: '100%',
          padding: 16,
          paddingHorizontal: 24,
          color: textColor,
        }}
        placeholderTextColor={placeholderTextColor}
      />
    </>
  )
}

export default Input
