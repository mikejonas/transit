import React from 'react'
import { Dimensions } from 'react-native'
import Text from 'components/Text'
import Box from 'components/Box'

interface HoroscopeCardProps {
  text: string
  title: string
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ text, title }) => {
  const screenWidth = Dimensions.get('window').width
  const cardWidth = screenWidth * 0.8

  return (
    <Box style={{ backgroundColor: '#282828' }} p="m" borderRadius={9} width={cardWidth}>
      <Box mb="xs">
        <Text fontWeight="500" color="text">
          {title}
        </Text>
      </Box>
      <Text numberOfLines={4} color="textSecondary">
        {text}
      </Text>
    </Box>
  )
}

export default HoroscopeCard
