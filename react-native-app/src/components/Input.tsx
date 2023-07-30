// components/Input.js
import React from 'react'
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme/restyle'
import adjustColorBrightness from '../utils/adjustColorBrightness'

interface InputProps extends RNTextInputProps {
  label?: string
}

const Input = ({ label, ...props }: InputProps) => {
  const theme = useTheme<Theme>()

  const errorColor = theme.colors.error
  const textColor = theme.colors.text
  const borderColor = adjustColorBrightness(textColor, -0.7)
  const placeholderTextColor = adjustColorBrightness(theme.colors.text, -0.25)

  return (
    <>
      <RNTextInput
        {...props}
        style={{
          height: 40,
          width: '100%',
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 20,
          padding: 10,
          color: textColor,
        }}
        placeholderTextColor={placeholderTextColor}
      />
    </>
  )
}

export default Input
