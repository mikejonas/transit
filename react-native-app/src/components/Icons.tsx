import React from 'react'
// import Feather from 'react-native-vector-icons/Feather'
// import Foundation from 'react-native-vector-icons/Foundation'
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

type IconProps = {
  size?: number
  color?: string
}

// Feather

export const ArrowUp = ({ size = 24, color = '#000' }: IconProps) => (
  <Octicons name="arrow-up" size={size} color={color} />
)
export const ThumbsDown = ({ size = 24, color = '#000' }: IconProps) => (
  <Octicons name="thumbsdown" size={size} color={color} />
)
export const ThumbsUp = ({ size = 24, color = '#000' }: IconProps) => (
  <Octicons name="thumbsup" size={size} color={color} />
)
