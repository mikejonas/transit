import * as React from 'react'
import { Text, StatusBar } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'

import ChatScreen from '../../screens/Chat'
import { darkTheme } from '../../theme/restyle'

export type StackNavigatorParams = {
  DailyHoroscope: undefined
  WeeklyHoroscope: undefined
  MonthlyHoroscope: undefined
}

const Drawer = createDrawerNavigator<StackNavigatorParams>()

const MainNavigator = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Drawer.Navigator
        initialRouteName="DailyHoroscope"
        screenOptions={{
          // example of using custom styling from restyle
          drawerActiveTintColor: darkTheme.colors.title,
          drawerInactiveTintColor: darkTheme.colors.text,
          drawerStyle: {
            backgroundColor: darkTheme.colors.background,
          },
          headerStyle: {
            backgroundColor: darkTheme.colors.background,
            borderBottomWidth: 0,
            shadowOpacity: 0, // this removes the bottom border
            elevation: 0, // this removes shadow on Android
          },
          headerTintColor: darkTheme.colors.title,
        }}>
        <Drawer.Screen
          name="DailyHoroscope"
          component={ChatScreen}
          options={{
            headerTitle: 'Today',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: ({ focused, color }) => (
              <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>Today</Text>
            ),
          }}
        />
        <Drawer.Screen
          name="WeeklyHoroscope"
          component={ChatScreen}
          options={{
            headerTitle: 'This Week',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: ({ focused, color }) => (
              <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>This Week</Text>
            ),
          }}
        />
        <Drawer.Screen
          name="MonthlyHoroscope"
          component={ChatScreen}
          options={{
            headerTitle: 'This Month',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: ({ focused, color }) => (
              <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>This Month</Text>
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  )
}

export default MainNavigator
