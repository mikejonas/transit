import React from 'react'
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native'
import Icon, { IconNames } from './Icon' // ensure this path is correct
import adjustColorBrightness from '../utils/adjustColorBrightness'

interface ButtonProps {
  title?: string
  onPress: () => void
  color?: string
  icon?: IconNames
}

const Button: React.FC<ButtonProps> = ({ title, onPress, color = '#000000', icon }) => {
  const pressedColor = adjustColorBrightness(color, 0.25)
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [styles.button, { backgroundColor: pressedColor }]
          : [styles.button, { backgroundColor: color }]
      }
      onPress={onPress}>
      <View style={styles.content}>
        {icon && <Icon name={icon} size={12} />}
        {title && <Text style={styles.text}>{title}</Text>}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    minWidth: 32,

    borderRadius: 25,
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
