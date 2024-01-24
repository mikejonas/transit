import React, { forwardRef, useImperativeHandle, useRef, useMemo } from 'react'
import BottomSheet, { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import Animated, {
  WithSpringConfig,
  WithTimingConfig,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import Box from 'components/Box'

interface CustomBottomSheetModalProps {
  children: React.ReactNode
  // methods from @gorhom/bottom-sheet
  // if api changes we may need to update this
  onChange?: (index: number) => void
  onAnimate?: (from: number, to: number) => void
}

export interface BottomSheetModalMethods {
  /**
   * Mount and present the bottom sheet modal to the initial snap point.
   * @param data to be passed to the modal.
   */
  present: (data?: any) => void
  /**
   * Close and unmount the bottom sheet modal.
   * @param animationConfigs snap animation configs.
   *
   * @see {WithSpringConfig}
   * @see {WithTimingConfig}
   */
  dismiss: (animationConfigs?: WithSpringConfig | WithTimingConfig) => void
}

const CustomBottomSheetModal = forwardRef<BottomSheetModalMethods, CustomBottomSheetModalProps>(
  ({ children, onAnimate, onChange }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModalMethods>(null)

    // Extend the ref methods
    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.present()
      },
      dismiss: () => bottomSheetRef.current?.dismiss(),
      // Add other methods as needed
    }))

    const snapPoints = useMemo(() => ['100%'], [])

    return (
      <BottomSheetModal
        ref={bottomSheetRef as any}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            onPress={() => bottomSheetRef.current?.dismiss()}
            opacity={1}
            disappearsOnIndex={-1}
          />
        )}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}
        onChange={onChange}
        onAnimate={onAnimate}>
        <Box style={{ marginBottom: 50, flex: 1 }}>{children}</Box>
      </BottomSheetModal>
    )
  },
)

export default CustomBottomSheetModal

interface CustomBackgroundProps {
  style?: StyleProp<ViewStyle>
  animatedIndex: Animated.SharedValue<number>
}

const CustomBackground: React.FC<CustomBackgroundProps> = ({ style, animatedIndex }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedIndex.value, [0, 1], ['#1a1a1a', '#2C2C2C']),
    borderRadius: interpolate(animatedIndex.value, [0, 1], [0, 15]),
  }))

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

// Custom Handle
const CustomHandle = () => (
  <View style={styles.handleContainer}>
    <View style={styles.handleBar} />
  </View>
)

const styles = StyleSheet.create({
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#333',
  },
})
