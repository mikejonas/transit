import React from 'react'
import { Image } from 'react-native'

export const ICONS = {
  UP_ARROW: require('@assets/icons/up-arrow.png'),
  // add other icons here...
}

export type IconNames = keyof typeof ICONS

interface IconProps {
  name: IconNames
  size?: number
  color?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'white' }) => {
  return <Image source={ICONS[name]} style={{ width: size, height: size, tintColor: color }} />
}

export default Icon
