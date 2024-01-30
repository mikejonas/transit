import React, { useEffect, useState } from 'react'
import { Animated } from 'react-native'
import Box from 'components/Box'
import { ThumbsDown, ThumbsUp } from 'components/Icons'
import OrbitTest from 'components/OrbitTest' // Make sure the import path is correct
import Text from 'components/Text'
import { useRoute } from '@react-navigation/native'
import { ConversationThreadRouteProps } from 'navigators/HomeNavigator'
import BlinkingCursor from './BlinkingCursor'
interface AssistantResponseProps {
  assistantMessage: string
  isResponsePending?: boolean
}

const AssistantResponse: React.FC<AssistantResponseProps> = ({
  assistantMessage,
  isResponsePending,
}) => {
  const route = useRoute<ConversationThreadRouteProps>()

  const scale = useState(new Animated.Value(2))[0]
  const translateX = useState(new Animated.Value(57))[0]
  const translateY = useState(new Animated.Value(80))[0]
  const translateYThirdAndLastRow = useState(new Animated.Value(800))[0]
  const [isAnimationActive, setIsAnimationActive] = useState(false)
  const opacity = useState(new Animated.Value(0))[0]

  // TODO remove !isResponsePending to work on animation again
  const showInitialAnimation = !route.params.conversationId && !isResponsePending

  const maybeAnimate = (ms: number) => {
    return showInitialAnimation ? ms : 0
  }

  useEffect(() => {
    setIsAnimationActive(true)
    const timer = setTimeout(() => {
      setIsAnimationActive(false)
    }, maybeAnimate(2000))

    const transitAnimation = Animated.sequence([
      Animated.delay(maybeAnimate(2000)),
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: maybeAnimate(400),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: maybeAnimate(400),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: maybeAnimate(400),
          useNativeDriver: true,
        }),
      ]),
    ])

    // New animation for third and last row
    const slideUpAnimation = Animated.sequence([
      Animated.delay(maybeAnimate(2000)),
      Animated.timing(translateYThirdAndLastRow, {
        toValue: 0,
        duration: maybeAnimate(400),
        useNativeDriver: true,
      }),
    ])

    const fadeInAnimation = Animated.sequence([
      Animated.delay(maybeAnimate(2000)),
      Animated.timing(opacity, {
        toValue: 1,
        duration: maybeAnimate(200),
        useNativeDriver: true,
      }),
    ])

    // Combined animation
    Animated.parallel([transitAnimation, slideUpAnimation, fadeInAnimation]).start()

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const renderTransitAnimation = () => (
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
        alignItems: 'center',
      }}>
      <Box height={105} aspectRatio={1}>
        <OrbitTest isAnimationActive={showInitialAnimation && isAnimationActive} />
      </Box>
    </Animated.View>
  )

  const renderTransitLabel = () => (
    <Animated.View
      style={{
        transform: [{ translateY: translateYThirdAndLastRow }],
        opacity: opacity, // Include opacity here
        borderColor: opacity.interpolate({
          inputRange: [0, 1],
          outputRange: ['rgba(187,187,187,0)', 'rgba(187,187,187,1)'],
        }),
        borderLeftWidth: 0,
        borderWidth: 1,
      }}>
      <Box flex={1} alignItems="center" justifyContent="center" height={105}>
        <Box p="m">
          <Text>Transiting Venus sesquiquadrate natal sun in capricorn</Text>
        </Box>
      </Box>
    </Animated.View>
  )

  const renderResponse = () => (
    <Box>
      <Animated.View
        style={{
          transform: [{ translateY: translateYThirdAndLastRow }],
          opacity: opacity, // Include opacity here
        }}>
        <Box mb="m">
          <Text variant="sectionTitle">Response</Text>
        </Box>
        {isResponsePending ? (
          <Box mb="m">
            <BlinkingCursor />
          </Box>
        ) : (
          <Text lineHeight={26}>{assistantMessage}</Text>
        )}
      </Animated.View>
    </Box>
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

  const renderTransits = () => {
    return (
      <Box>
        <Animated.View
          style={{
            // transform: [{ translateY: translateX }],
            opacity: opacity, // Include opacity here
          }}>
          <Box mb="m">
            <Text variant="sectionTitle">Transit</Text>
          </Box>
        </Animated.View>
        <Box flexDirection="row">
          <Box flex={1}>{renderTransitAnimation()}</Box>
          <Box flex={2}>{renderTransitLabel()}</Box>
        </Box>
      </Box>
    )
  }

  return (
    <>
      {showInitialAnimation && (
        <Box mb="l" px="l">
          {renderTransits()}
        </Box>
      )}
      <Box px="l">{renderResponse()}</Box>
    </>
  )
}

export default AssistantResponse
