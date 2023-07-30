import { StyleSheet, TouchableOpacity } from 'react-native'
import Box from './Box'
import Text from './Text'

interface TextbuttonProps {
  onPress: () => void
  children: React.ReactNode
}

const Textbutton = ({ onPress, children }: TextbuttonProps) => {
  return (
    <Box alignItems="center">
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.text}>{children}</Text>
      </TouchableOpacity>
    </Box>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export default Textbutton
