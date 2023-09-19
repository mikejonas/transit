import React, { useState } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import Box from 'components/Box'
import Text from 'components/Text'

const { width } = Dimensions.get('window')
const itemWidth = width / 6

const categories = ['Self', 'Family', 'Love', 'Work', 'Finance']

type CategoryItemProps = {
  item: string
  isActive: boolean
  onSelect: (category: string) => void
}

const CategoryItem = ({ item, isActive, onSelect }: CategoryItemProps) => (
  <TouchableOpacity onPress={() => onSelect(item)}>
    <Box
      width={itemWidth}
      marginHorizontal="xs"
      paddingBottom="s"
      alignItems="center"
      justifyContent="center"
      borderBottomWidth={isActive ? 2 : 0}
      borderColor="text">
      <Box width={40} height={40} borderRadius={3} backgroundColor="textSecondary" />
      <Box marginTop="s">
        <Text>{item}</Text>
      </Box>
    </Box>
  </TouchableOpacity>
)
const CategoryList = () => {
  const [activeCategory, setActiveCategory] = useState('Self')

  return (
    <Box flexDirection="row" justifyContent="center">
      {categories.map(category => (
        <CategoryItem
          key={category}
          item={category}
          isActive={category === activeCategory}
          onSelect={setActiveCategory}
        />
      ))}
    </Box>
  )
}

export default CategoryList
