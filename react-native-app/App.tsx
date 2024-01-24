import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import AppNavigator from 'navigators/AppNavigator'
import TestNavigator from 'navigators/TestNavigator'
import { darkTheme } from 'theme/restyle'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <NavigationContainer>
          {/* <TestNavigator /> */}
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default App
