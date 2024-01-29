import React, { useCallback, useMemo } from 'react'

import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useNavigation } from '@react-navigation/native' // Import useNavigation
import { HomeNavigationProps } from 'navigators/HomeNavigator'

import Box from 'components/Box'
import Text from 'components/Text'
import { Pressable, Keyboard } from 'react-native'

const App = () => {
  const navigation = useNavigation<HomeNavigationProps>()

  const data = [
    'question example',
    'another question example',
    'yet another question example',
    'question example...',
    'one more question example',
  ]

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Box py="m" px="s" key={item} borderBottomWidth={1} style={{ borderColor: '#282828' }}>
        <Pressable
          onPress={() => {
            navigation.navigate('ConversationThread', {
              newThreadFirstMessage: item,
            })
            Keyboard.dismiss()
          }}>
          <Text color="text">{item}</Text>
        </Pressable>
      </Box>
    ),
    [],
  )

  return (
    <>
      <BottomSheetScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
        <Box mx="m">{data.map(item => renderItem({ item }))}</Box>
        <Box px="l" justifyContent="center" alignItems="center" width="100%" height="70%"></Box>
      </BottomSheetScrollView>
    </>
  )
}

export default App
