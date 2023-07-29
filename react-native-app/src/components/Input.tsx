// components/CustomTextInput.js
import React from 'react'
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native'
import Box from './Box'
import Text from './Text'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../theme/restyle'
import adjustColorBrightness from '../utils/adjustColorBrightness'

interface CustomTextInputProps extends RNTextInputProps {
  label?: string
}

const CustomTextInput = ({ label, ...props }: CustomTextInputProps) => {
  const theme = useTheme<Theme>()

  const errorColor = theme.colors.error
  const textColor = theme.colors.text
  const borderColor = adjustColorBrightness(textColor, -0.7)
  return (
    <>
      <RNTextInput
        {...props}
        style={{
          height: 40,
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 100,
          flex: 1,
          padding: 10,
          color: textColor,
        }}
      />
    </>
  )
}

export default CustomTextInput
