import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { XIcon } from 'components/Icons' // Your custom icon component
import Box from 'components/Box'
interface CustomHeaderProps {
  title?: string
  onBackPress?: () => void
}

const CustomHeader = ({ title, onBackPress }: CustomHeaderProps) => {
  const renderBack = () => {
    return (
      <TouchableOpacity onPress={onBackPress}>
        <XIcon color="#fff" />
      </TouchableOpacity>
    )
  }
  const renderTitle = () => {
    return (
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
    )
  }

  return (
    <Box flexDirection="row" justifyContent="space-between" mx="l" mb="l">
      <Box width={50}>{onBackPress && renderBack()}</Box>
      <Box>{title && renderTitle()}</Box>
      <Box width={50} alignItems="flex-end"></Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'normal',
  },
})

export default CustomHeader
