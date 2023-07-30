import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import AppNavigator from 'navigators/AppNavigator'
import { darkTheme } from 'theme/restyle'

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
  )
}

export default App
