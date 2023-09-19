import React, { useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import Box from 'components/Box'
import Text from 'components/Text'

const questions = [
  'Am I truly romantic?',
  'Is career affecting my relationships?',
  'Am I ready for commitment?',
  "What's my ideal relationship?",
  'Am I more physical or emotional?',
  'Are friends swaying my love?',
  'Can I compromise in love?',
  'Is my past affecting love?',
  'Do I attract opposites?',
]

type QuestionsListProps = {
  onPress?: () => void
}

const QuestionsList: React.FC<QuestionsListProps> = ({ onPress }) => {
  return (
    <Box>
      <FlatList
        data={questions}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={onPress}>
            <Box alignItems="center" padding="m">
              <Text textDecorationLine="underline" color="text">
                {item}
              </Text>
            </Box>
          </TouchableOpacity>
        )}
      />
    </Box>
  )
}

export default QuestionsList
