import React from 'react'
import { Pressable, Text, StyleSheet, View } from 'react-native'
import adjustColorBrightness from 'utils/adjustColorBrightness'
import Icon, { IconNames } from './Icon' // ensure this path is correct

type ButtonSize = 'small' | 'medium'

interface ButtonProps {
  children?: React.ReactNode
  title?: string
  onPress: () => void
  color?: string
  icon?: IconNames
  isLoading?: boolean
  size?: ButtonSize
}

const Button: React.FC<ButtonProps> = ({
  children,
  title,
  onPress,
  color = '#000000',
  icon,
  size = 'small',
}) => {
  const pressedColor = adjustColorBrightness(color, 0.25)
  const buttonSize = size === 'small' ? styles.small : styles.medium

  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [buttonSize, { backgroundColor: pressedColor }]
          : [buttonSize, { backgroundColor: color }]
      }
      onPress={onPress}>
      <View style={styles.content}>
        {icon && <Icon name={icon} size={12} />}
        {title && <Text style={styles.text}>{title}</Text>}
        {children && children}
      </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10, // add space between the icon and the text
  },
})

export default Button
