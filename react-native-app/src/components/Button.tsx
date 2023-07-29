import React from 'react';
import {Pressable, Text, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import adjustColorBrightness from '../utils/adjustColorBrightness';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({title, onPress, color = '#000000'}) => {
  const pressedColor = adjustColorBrightness(color, 0.25);
  return (
    <Pressable
      style={({pressed}) =>
        pressed
          ? [styles.button, {backgroundColor: pressedColor}]
          : [styles.button, {backgroundColor: color}]
      }
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 2,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;
