import React, { forwardRef } from 'react'
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from 'theme/restyle'
import adjustColorBrightness from 'utils/adjustColorBrightness'

interface InputProps extends RNTextInputProps {}

const Input = forwardRef<RNTextInput, InputProps>((props, ref) => {
  const theme = useTheme<Theme>()

  const textColor = theme.colors.text
  const placeholderTextColor = adjustColorBrightness(theme.colors.text, -0.25)

  return (
    <RNTextInput
      ref={ref}
      {...props}
      style={{
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        height: 48,
        width: '100%',
        padding: 16,
        paddingHorizontal: 24,
        color: textColor,
      }}
      placeholderTextColor={placeholderTextColor}
    />
  )
})

export default Input
