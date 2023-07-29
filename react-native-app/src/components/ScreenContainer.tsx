import React from 'react';
import {View, StyleSheet} from 'react-native';

interface ScreenProps {
  children: React.ReactNode;
  verticalCenter?: boolean; // New prop
}

const ScreenContainer: React.FC<ScreenProps> = ({children, verticalCenter}) => {
  return (
    <View
      style={[styles.screen, verticalCenter ? styles.verticalCenter : null]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24, // or whatever padding you prefer
    paddingVertical: 24,
  },
  verticalCenter: {
    justifyContent: 'center',
  },
});

export default ScreenContainer;
