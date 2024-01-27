import React, { useEffect, useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native'
import Text from 'components/Text'
import Box from 'components/Box'
import sampleQuestions from './sampleQuestions'

const makeRowsOfQuestions = (questions: string[], rowCount: number) => {
  const rows = new Array(rowCount).fill(null).map(() => []) as string[][]
  const rowWidths = new Array(rowCount).fill(0) as number[]
  const ADDED_WIDTH_FOR_MARGIN = 3
  for (let question of questions) {
    const length = question.length
    const minRowWidthIndex = rowWidths.indexOf(Math.min(...rowWidths))
    rows[minRowWidthIndex].push(question)
    rowWidths[minRowWidthIndex] += length + ADDED_WIDTH_FOR_MARGIN
  }
  return rows
}

type SampleQuestionsCarouselProps = {
  onPress: (question: string) => void
}

const SampleQuestionsCarousel = ({ onPress }: SampleQuestionsCarouselProps) => {
  const [scrollPercent, setScrollPercent] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [intervalId, setIntervalId] = useState<number | null>(null)

  useEffect(() => {
    if (contentWidth && scrollViewRef.current) {
      const halfWidth = contentWidth / 2
      scrollViewRef.current.scrollTo({ x: halfWidth, animated: false })
    }
  }, [contentWidth])

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let scrollPosition = e.nativeEvent.contentOffset.x
    let scrollViewWidth = e.nativeEvent.layoutMeasurement.width
    let percentageScrolled = (scrollPosition / (contentWidth - scrollViewWidth)) * 100
    setScrollPercent(percentageScrolled)
  }

  const handleContentSizeChange = (contentWidth: number, contentHeight: number) => {
    setContentWidth(contentWidth)
  }

  const renderQuestion = (question: string) => {
    return (
      <Box m="xs" key={question}>
        <TouchableOpacity onPress={() => onPress(question)}>
          <Box borderRadius={4} style={{ backgroundColor: '#282828' }} py="s" px="s">
            <Text color="textSecondary">{question}</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    )
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onContentSizeChange={handleContentSizeChange}>
      <Box flex={1}>
        {makeRowsOfQuestions(sampleQuestions, 3).map((row, index) => (
          <Box style={{ flexDirection: 'row' }} key={row[0]}>
            {row.map((question, index) => renderQuestion(question))}
          </Box>
        ))}
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({})

export default SampleQuestionsCarousel
