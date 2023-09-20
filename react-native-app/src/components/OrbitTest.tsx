import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  withRepeat,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  useAnimatedProps,
  cancelAnimation,
  withSpring,
  useAnimatedReaction,
} from 'react-native-reanimated'
import Svg, { Line } from 'react-native-svg'

const AnimatedLine = Animated.createAnimatedComponent(Line)

const OrbitTest = ({ isAnimationActive }) => {
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 })

  const planets = [
    { size: 22, speed: 6000, initial: 340, color: '#F0F0F0', id: 'moon' },
    { size: 18, speed: 3000, initial: 90, color: '#ff9696', id: 'mercury' },
    { size: 20, speed: 5000, initial: 30, color: '#FFFFFF', id: 'planet-1' },
    { size: 15, speed: 9000, initial: 290, color: '#909090', id: 'planet-5' },
    { size: 16, speed: 10000, initial: 270, color: '#707070', id: 'planet-6' },
    { size: 25, speed: 7000, initial: 40, color: '#D0D0D0', id: 'planet-3' },
  ]

  const onLayout = event => {
    const { width, height } = event.nativeEvent.layout
    setDimensions({ width, height })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onLayout={onLayout}>
      <View style={[styles.centerMass, styles.round]} />

      <Svg
        height={dimensions.height}
        width={dimensions.width}
        style={[
          styles.svgCentered,
          { marginTop: -dimensions.height / 2, marginLeft: -dimensions.width / 2 },
        ]}>
        {planets.map((planet, index) => (
          <OrbitingLine
            {...planet}
            key={planet.id}
            dimensions={dimensions}
            isAnimationActive={isAnimationActive}
          />
        ))}
      </Svg>
      {planets.map((planet, index) => (
        <OrbitingPlanet
          {...planet}
          key={planet.id}
          dimensions={dimensions}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </View>
  )
}

const useOrbitAnimation = (speed, initial, isAnimationActive, id) => {
  const orbitAnimation = useSharedValue(0)

  let stopAngle = null
  if (id === 'moon') stopAngle = 230
  if (id === 'mercury') stopAngle = 130

  const stoppedAngle = useSharedValue(null)

  useEffect(() => {
    if (isAnimationActive && stoppedAngle.value === null) {
      const animation = withRepeat(
        withTiming(1, { duration: speed, easing: Easing.linear }),
        -1,
        false,
      )
      orbitAnimation.value = animation
    }
  }, [orbitAnimation, speed, isAnimationActive])

  useAnimatedReaction(
    () => orbitAnimation.value,
    currentValue => {
      const adjustedAngle = Math.round((currentValue * 360 + initial) % 360)
      if (adjustedAngle === stopAngle && isAnimationActive === false) {
        stoppedAngle.value = stopAngle
        cancelAnimation(orbitAnimation)
      }
    },
  )

  return orbitAnimation
}

// ... rest of your code

const useOpacityAnimation = (isAnimationActive, id, planets) => {
  const planetOpacity = useSharedValue(isAnimationActive ? 1 : 0)
  const lineOpacity = useSharedValue(0) // Start with 0 opacity for lines

  useEffect(() => {
    if (planets.includes(id)) {
      planetOpacity.value = 1
      lineOpacity.value = withTiming(isAnimationActive ? 0 : 1, { duration: 100 }) // Fade in or out
    } else {
      planetOpacity.value = withTiming(isAnimationActive ? 1 : 0, { duration: 100 })
      lineOpacity.value = 0 // Keep it 0 for other planets
    }
  }, [isAnimationActive, id])

  return { planetOpacity, lineOpacity }
}

const OrbitingPlanet = ({ size, speed, initial, color, dimensions, isAnimationActive, id }) => {
  const orbitAnimation = useOrbitAnimation(speed, initial, isAnimationActive, id)
  const { planetOpacity } = useOpacityAnimation(isAnimationActive, id, ['moon', 'mercury'])

  const scaledSize = dimensions.width * (size / 300) // Assuming the original container width was 300

  const animatedStyle = useAnimatedStyle(() => {
    const spin = interpolate(orbitAnimation.value, [0, 1], [initial, initial + 360])
    const x = (dimensions.width / 3) * Math.cos((spin * Math.PI) / 180)
    const y = (dimensions.height / 3) * Math.sin((spin * Math.PI) / 180)

    return {
      width: scaledSize,
      height: scaledSize,
      opacity: planetOpacity.value,
      backgroundColor: color,
      position: 'absolute',
      borderRadius: scaledSize / 2,
      left: dimensions.width / 2 + x - scaledSize / 2,
      top: dimensions.height / 2 + y - scaledSize / 2,
    }
  })

  return <Animated.View style={[animatedStyle]} />
}

const OrbitingLine = ({ speed, initial, dimensions, isAnimationActive, id }) => {
  const orbitAnimation = useOrbitAnimation(speed, initial, isAnimationActive, id)
  const { lineOpacity } = useOpacityAnimation(isAnimationActive, id, ['moon', 'mercury'])

  const animatedProps = useAnimatedProps(() => {
    const spin = interpolate(orbitAnimation.value, [0, 1], [initial, initial + 360])
    const x = dimensions.width / 2 + (dimensions.width / 3) * Math.cos((spin * Math.PI) / 180)
    const y = dimensions.height / 2 + (dimensions.height / 3) * Math.sin((spin * Math.PI) / 180)

    return {
      x1: dimensions.width / 2,
      y1: dimensions.height / 2,
      x2: x,
      y2: y,
      opacity: lineOpacity.value,
    }
  })

  return <AnimatedLine stroke="#fff" strokeWidth="1" animatedProps={animatedProps} />
}

const styles = StyleSheet.create({
  svgCentered: {
    position: 'absolute',
  },
  centerMass: {
    width: '12%',
    height: '12%',
    backgroundColor: '#808080',
    zIndex: 1,
  },
  round: {
    borderRadius: 1000,
  },
})

export default OrbitTest
