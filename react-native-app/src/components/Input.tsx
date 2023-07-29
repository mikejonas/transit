// components/CustomTextInput.js
import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import Box from './Box';
import Text from './Text';
import {useTheme} from '@shopify/restyle';
import {Theme} from '../theme/restyle';

interface CustomTextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

const CustomTextInput = ({label, error, ...props}: CustomTextInputProps) => {
  const theme = useTheme<Theme>();

  const errorColor = theme.colors.error;
  const textColor = theme.colors.text;

  return (
    <Box marginVertical="s">
      {label && <Text variant="body">{label}</Text>}
      <RNTextInput
        {...props}
        style={{
          height: 40,
          borderColor: error ? errorColor : textColor,
          borderWidth: 1,
          borderRadius: 4,
          padding: 10,
          color: textColor,
        }}
      />
      {error && <Text variant="error">{error}</Text>}
    </Box>
  );
};

export default CustomTextInput;
