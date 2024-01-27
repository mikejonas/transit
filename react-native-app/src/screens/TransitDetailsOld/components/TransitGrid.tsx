import React, { useEffect, useState } from 'react'
import { View, Animated } from 'react-native'
import Box from 'components/Box'
import { ThumbsDown, ThumbsUp } from 'components/Icons'
import OrbitTest from 'components/OrbitTest' // Make sure the import path is correct
import Text from 'components/Text'

const TransitGrid = () => {
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

  const renderTitle = () => (
    <Box
      px="l"
      py="m"
      alignItems="center"
      justifyContent="center"
      borderRightWidth={1}
      borderWidth={1}
      borderColor="lightBorder"
      style={{ margin: -1 }}>
      <Text>Is career affecting my relationships?</Text>
    </Box>
  )

  const renderTransitAnimation = () => (
    <Box
      flex={1}
      alignItems="center"
      width="100%"
      justifyContent="center"
      style={{ marginHorizontal: -1 }}>
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
          style={{ marginRight: -1 }}>
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
      <Box p="m" borderWidth={1} borderColor="lightBorder" style={{ margin: -1 }}>
        <Text lineHeight={25}>
          There is indeed tension between your career and personal relationships right now. This
          aspect can amplify your ambition and work-related pursuits, governed by Capricorn's
          natural inclination for discipline and structure. However, Venus, the planet of
          relationships, is at a challenging angle, potentially causing strain as you try to balance
          your professional life with your personal connections. It may be a time to be cautious and
          considerate in both spheres to navigate through this period successfully.
        </Text>
      </Box>
      {/* Last Row: Thumbs up/down and Share */}
      <Box
        flexDirection="row"
        justifyContent="flex-end"
        p="m"
        borderRightWidth={1}
        borderLeftWidth={1}
        borderBottomWidth={1}
        borderColor="lightBorder"
        style={{ margin: -1 }}>
        <Box flexDirection="row">
          <Box mr="s">
            <ThumbsUp size={18} color="#fff" />
          </Box>
          <Box>
            <ThumbsDown size={18} color="#fff" />
          </Box>
        </Box>
      </Box>
    </Animated.View>
  )

  return (
    <Box>
      {renderTitle()}
      <Box flexDirection="row">
        {renderTransitAnimation()}
        {renderRightColumnText()}
      </Box>
      {renderThirdAndLastRow()}
    </Box>
  )
}

export default TransitGrid
