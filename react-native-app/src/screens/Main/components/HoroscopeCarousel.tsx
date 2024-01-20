import React from 'react'
import { FlatList, View, StyleSheet } from 'react-native'
import HoroscopeCard from './HoroscopeCard' // Adjust the import path as necessary
import Box from 'components/Box'

interface HoroscopeItem {
  title: string
  text: string
}

interface HoroscopeCarouselProps {
  data: HoroscopeItem[]
}

const HoroscopeCarousel: React.FC<HoroscopeCarouselProps> = ({ data }) => {
  const renderItem = ({ item }: { item: HoroscopeItem }) => (
    <Box mx="s">
      <HoroscopeCard title={item.title} text={item.text} />
    </Box>
  )

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default HoroscopeCarousel

export const sampleData: HoroscopeItem[] = [
  {
    title: 'Yesterday',
    text: 'Today is a day for bold decisions. Trust your instincts and embrace the opportunities that come your way. A little courage goes a long way.',
  },
  {
    title: 'Today',
    text: 'Focus on balancing your personal and professional life. Harmony in both spheres is key to achieving a sense of fulfillment and success.',
  },
  {
    title: 'Tomorrow',
    text: 'Communication is key today. Express your thoughts clearly and listen actively. Your interactions could lead to meaningful connections.',
  },
  {
    title: 'This Week',
    text: 'Your emotional well-being should be your priority right now. Take time for self-care and nurturing relationships that bring you joy.',
  },
  {
    title: 'This Month',
    text: 'Your creativity is at a peak today. Embark on new artistic endeavors or revive old hobbies. Let your imagination guide you to new expressions.',
  },
]
