import * as Sentry from '@sentry/react-native'
import { captureConsoleIntegration } from '@sentry/integrations'

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import RootNavigator from 'navigators/RootNavigator'
import { darkTheme } from 'theme/restyle'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN as string, // https://mike-jonas.sentry.io/settings/projects/transit-app/keys/
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [captureConsoleIntegration({ levels: ['error'] })],
})

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

export default Sentry.wrap(App)
