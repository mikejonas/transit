import React, { useEffect, useState } from 'react'
import { View, Animated } from 'react-native'
import Box from 'components/Box'
import { ThumbsDown, ThumbsUp } from 'components/Icons'
import OrbitTest from 'components/OrbitTest' // Make sure the import path is correct
import Text from 'components/Text'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { useRoute } from '@react-navigation/native'
import { ConversationThreadRouteProps } from 'navigators/HomeNavigator'

const TransitGrid = () => {
  const route = useRoute<ConversationThreadRouteProps>()

  const scale = useState(new Animated.Value(2))[0]
  const translateX = useState(new Animated.Value(45))[0]
  const translateY = useState(new Animated.Value(80))[0]
  const translateYThirdAndLastRow = useState(new Animated.Value(800))[0]
  const [isAnimationActive, setIsAnimationActive] = useState(true)
  const opacity = useState(new Animated.Value(0))[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationActive(false)
    }, 2000)

    const transitAnimation = Animated.sequence([
      Animated.delay(2000),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ])

    // New animation for third and last row
    const slideUpAnimation = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(translateYThirdAndLastRow, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ])

    const fadeInAnimation = Animated.sequence([
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])

    // Combined animation
    Animated.parallel([transitAnimation, slideUpAnimation, fadeInAnimation]).start()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const renderTitle = () => <Text variant="sectionTitle">{route.params.title}</Text>

  const renderTransitAnimation = () => (
    <Box
      flex={1}
      alignItems="center"
      width="100%"
      justifyContent="center"
      style={{ marginHorizontal: 0 }}>
      <Animated.View
        style={{
          flex: 1,
          width: '100%',
          borderColor: opacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(187,187,187,0)', 'rgba(187,187,187,1)'],
          }),
          borderWidth: 1,
          transform: [
            { scaleX: scale },
            { scaleY: scale },
            { translateX: translateX },
            { translateY: translateY },
          ],
        }}>
        <Box height="100%" justifyContent="center" alignItems="center">
          <Box aspectRatio={1} flex={1} alignContent="center" justifyContent="center">
            <OrbitTest isAnimationActive={isAnimationActive} />
          </Box>
        </Box>
      </Animated.View>
    </Box>
  )

  const renderRightColumnText = () => (
    <Box flex={1} minHeight={150}>
      <Animated.View
        style={{
          transform: [{ translateY: translateYThirdAndLastRow }],
          opacity: opacity, // Include opacity here
        }}>
        <Box
          flex={1}
          alignItems="center"
          justifyContent="center"
          minHeight={150}
          borderWidth={1}
          borderColor="lightBorder"
          style={{ marginRight: 0 }}>
          <Box p="m">
            <Text>Transiting Venus sesquiquadrate natal sun in capricorn</Text>
          </Box>
        </Box>
      </Animated.View>
    </Box>
  )

  const renderThirdAndLastRow = () => (
    <Animated.View
      style={{
        transform: [{ translateY: translateYThirdAndLastRow }],
        opacity: opacity, // Include opacity here
      }}>
      {/* Third Row: Body */}
      <Box mb="l">
        <Text lineHeight={26} fontSize={16}>
          There is indeed tension between your career and personal relationships right now. This
          aspect can amplify your ambition and work-related pursuits, governed by Capricorn's
          natural inclination for discipline and structure. However, Venus, the planet of
          relationships, is at a challenging angle, potentially causing strain as you try to balance
          your professional life with your personal connections. It may be a time to be cautious and
          considerate in both spheres to navigate through this period successfully.
        </Text>
      </Box>
      <Box>
        <Text lineHeight={26} fontSize={16}>
          Mindful decision-making is key during this time. As you focus on your career goals,
          remember to allocate time for your loved ones, ensuring that your personal relationships
          don't suffer due to your professional aspirations. This balance might require setting
          clear boundaries and communicating openly with both colleagues and family or friends.
          Embrace flexibility, allowing yourself to adjust as situations evolve. By managing your
          time and priorities effectively, you can maintain harmony in both areas of your life,
          fostering growth and satisfaction on a personal and professional level.
        </Text>
      </Box>
    </Animated.View>
  )

  const renderLikeDislikeButtons = () => {
    return (
      <Box flexDirection="row" justifyContent="flex-end" p="s" style={{ margin: -1 }}>
        <Box flexDirection="row">
          <Box mr="s">
            <ThumbsUp size={18} color="#fff" />
          </Box>
          <Box>
            <ThumbsDown size={18} color="#fff" />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <BottomSheetScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
      <Box mb="m" px="l">
        {renderTitle()}
      </Box>
      <Box flexDirection="row" mb="m" px="l">
        {renderTransitAnimation()}
        {renderRightColumnText()}
      </Box>
      <Box px="l">{renderThirdAndLastRow()}</Box>
    </BottomSheetScrollView>
  )

  return (
    <BottomSheetScrollView>
      <Box style={{ flexGrow: 1, flex: 1, backgroundColor: 'pink', height: '100%', width: '100%' }}>
        <Text lineHeight={26} fontSize={16} color="text">
          There is indeed tension between your career and personal relationships right now. This
          aspect can amplify your ambition and work-related pursuits, governed by Capricorn's
          natural inclination for discipline and structure. However, Venus, the planet of
          relationships, is at a challenging angle, potentially causing strain as you try to balance
          your professional life with your personal connections. It may be a time to be cautious and
          considerate in both spheres to navigate through this period successfully.
        </Text>
      </Box>
      <Box>
        <Text lineHeight={26} fontSize={16}>
          Mindful decision-making is key during this time. As you focus on your career goals,
          remember to allocate time for your loved ones, ensuring that your personal relationships
          don't suffer due to your professional aspirations. This balance might require setting
          clear boundaries and communicating openly with both colleagues and family or friends.
          Embrace flexibility, allowing yourself to adjust as situations evolve. By managing your
          time and priorities effectively, you can maintain harmony in both areas of your life,
          fostering growth and satisfaction on a personal and professional level.
        </Text>
      </Box>
      <Box>
        <Text lineHeight={26} fontSize={16}>
          Mindful decision-making is key during this time. As you focus on your career goals,
          remember to allocate time for your loved ones, ensuring that your personal relationships
          don't suffer due to your professional aspirations. This balance might require setting
          clear boundaries and communicating openly with both colleagues and family or friends.
          Embrace flexibility, allowing yourself to adjust as situations evolve. By managing your
          time and priorities effectively, you can maintain harmony in both areas of your life,
          fostering growth and satisfaction on a personal and professional level.
        </Text>
      </Box>
    </BottomSheetScrollView>
  )
}

export default TransitGrid
