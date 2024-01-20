import React from 'react'
import { Pressable, StyleSheet, View, ActivityIndicator } from 'react-native'
import adjustColorBrightness from 'utils/adjustColorBrightness'
import Icon, { IconNames } from './Icon' // ensure this path is correct
import Box from 'components/Box'
import Text from 'components/Text'
type ButtonSize = 'small' | 'medium'

interface ButtonProps {
  children?: React.ReactNode
  title?: string
  onPress: () => void
  backgroundColor?: string
  icon?: IconNames
  isLoading?: boolean
  size?: ButtonSize
  disabled?: boolean
  varient?: 'primary' | 'secondary'
}

const variants = {
  primary: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
  secondary: {
    backgroundColor: '#353535',
    textColor: '#ffffff',
  },
  disabled: {
    backgroundColor: '#555555',
    textColor: '#bbbbbb',
  },
}

const getColor = (disabled: boolean, varient: 'primary' | 'secondary') => {
  if (disabled) {
    return variants.disabled
  }

  return variants[varient]
}

const Button: React.FC<ButtonProps> = ({
  children,
  title,
  onPress,
  icon,
  isLoading = false,
  size = 'small',
  disabled = false,
  varient = 'primary',
}) => {
  const { backgroundColor, textColor } = getColor(disabled, varient)

  const pressedColor = adjustColorBrightness(backgroundColor, disabled ? 0 : -0.2)
  const buttonSize = size === 'small' ? styles.small : styles.medium

  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? { ...buttonSize, backgroundColor: pressedColor }
          : { ...buttonSize, backgroundColor }
      }
      onPress={isLoading ? undefined : onPress}
      disabled={isLoading}>
      <Box flexDirection="row" alignItems="center">
        {isLoading ? <ActivityIndicator color="#000000" /> : null}
        {icon && !isLoading && <Icon name={icon} size={12} />}
        {title && !isLoading && (
          <Text style={{ ...styles.text, color: textColor }} fontWeight={'500'}>
            {title}
          </Text>
        )}
        {!isLoading && children}
      </Box>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  small: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    minWidth: 32,
    borderRadius: 25,
    elevation: 2,
  },
  medium: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    minWidth: 48,
    borderRadius: 30,
    elevation: 2,
  },
  text: {
    textAlign: 'center',
    marginLeft: 10, // add space between the icon and the text
  },
})

export default Button
