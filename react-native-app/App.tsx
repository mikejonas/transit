import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import RootNavigator from 'navigators/RootNavigator'
import { darkTheme } from 'theme/restyle'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default App
