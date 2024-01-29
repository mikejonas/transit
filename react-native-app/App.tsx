import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import RootNavigator from 'navigators/RootNavigator'
import { darkTheme } from 'theme/restyle'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default App
