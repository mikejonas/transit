import React, { ReactNode, useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Text from 'components/Text'

interface ConversationButtonProps {
  children: ReactNode
  onPress: () => void
}

const ConversationButton: React.FC<ConversationButtonProps> = ({ children, onPress }) => {
  const [isActive, setIsActive] = useState(false)

  const handlePressIn = () => {
    setIsActive(true)
  }

  const handlePressOut = () => {
    setIsActive(false)
  }

  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.active]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    padding: 6,
    borderRadius: 6,
  },
  active: {
    backgroundColor: '#333',
  },
  text: {
    color: 'white',
  },
})

export default ConversationButton
