import * as React from 'react'
import { StatusBar, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import MainScreen from 'screens/Main'
import { Theme, darkTheme } from 'theme/restyle'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import ConversationScreen from '../../screens/Conversation'
import { useTheme } from '@shopify/restyle'
import DrawerToggleButton from './DrawerToggleButton'
export type StackNavigatorProps = {
  MainScreen: undefined
  ConversationThread: { conversationId?: number; newThreadFirstMessage?: string }
}

const Stack = createStackNavigator<StackNavigatorProps>()

export type HomeNavigationProps = StackNavigationProp<StackNavigatorProps, 'MainScreen'>
export type ConversationThreadNavigationProps = StackNavigationProp<
  StackNavigatorProps,
  'ConversationThread'
>

export type ConversationThreadRouteProps = RouteProp<StackNavigatorProps, 'ConversationThread'>

const HomeNavigator = () => {
  const theme = useTheme<Theme>()

  return (
    <View testID="TestNavigator" style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator
          initialRouteName="MainScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: darkTheme.colors.background,
              borderBottomWidth: 0,
              shadowOpacity: 0,
              elevation: 0,
            },
            cardStyle: {
              backgroundColor: 'transparent',
            },
            presentation: 'modal',
            gestureEnabled: true,
            gestureResponseDistance: 1000, // @TODO this might b too much
            headerTintColor: darkTheme.colors.title,
          }}>
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{
              headerShown: true,
              headerTitle: 'transit',
              headerTitleStyle: {
                color: 'white',
                fontSize: 26,
                fontWeight: 'normal',
              },
              headerLeft: () => <DrawerToggleButton />,
            }}
          />
          <Stack.Screen
            name="ConversationThread"
            component={ConversationScreen}
            initialParams={{ conversationId: undefined, newThreadFirstMessage: undefined }}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </BottomSheetModalProvider>
    </View>
  )
}

export default HomeNavigator
