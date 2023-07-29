import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigators/AppNavigator';
import {ThemeProvider} from '@shopify/restyle';
import {darkTheme, lightTheme} from './src/theme/restyle';

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
