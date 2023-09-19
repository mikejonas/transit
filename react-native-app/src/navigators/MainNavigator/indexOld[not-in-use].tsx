// this is from when we just did chat. Keeping it for now, incase we want to easily reference it.

import * as React from 'react'
import { useEffect } from 'react'
import { StatusBar } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { RouteProp } from '@react-navigation/native'
import Text from 'components/Text'
import { StackNavigatorParams } from 'navigators/AppNavigator'
import { requests } from 'requests'
import ChatScreen from 'screens/Chat'
import { darkTheme } from 'theme/restyle'
import CustomDrawerContent from './CustomDrawerContent'

export type MainNavigatorProps = {
  route: RouteProp<StackNavigatorParams, 'MainNavigator'>
}
export type DrawerNavigatorParams = {
  DailyHoroscope: { conversationId?: number }
  WeeklyHoroscope: { conversationId?: number }
  MonthlyHoroscope: { conversationId?: number }
}

const Drawer = createDrawerNavigator<DrawerNavigatorParams>()

// todo: better handle how to render the label by extracting it its own component
// todo: better handle font sizes across the app
const renderLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text color="text" fontSize={15} fontWeight={focused ? 'bold' : 'normal'}>
    {label}
  </Text>
)
const DrawerLabel = (label: string) => (props: any) => renderLabel({ ...props, label })

const MainNavigator: React.FC<MainNavigatorProps> = () => {
  const [conversationId, setConversationId] = React.useState<number | undefined>()

  const getOrCreateConversation = async () => {
    const { data, error } = await requests.generated.getConversation()
    if (data) {
      // get conversation
      setConversationId(data.conversation_id)
    } else {
      // create conversation
      const { data: newData, error: newError } = await requests.edgeFunctions.newConversation()
      if (newData) setConversationId(newData.conversation_id)
      if (newError) console.log({ newError })
    }
    if (error) console.log({ error })
  }

  useEffect(() => {
    getOrCreateConversation()
  }, [])

  if (!conversationId) return null

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
        }}
        drawerContent={CustomDrawerContent}>
        <Drawer.Screen
          name="DailyHoroscope"
          component={ChatScreen}
          initialParams={{ conversationId }}
          options={{
            headerTitle: 'Today',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: DrawerLabel('Today'),
          }}
        />
        <Drawer.Screen
          name="WeeklyHoroscope"
          component={ChatScreen}
          initialParams={{ conversationId }}
          options={{
            headerTitle: 'This Week',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: DrawerLabel('This week'),
          }}
        />
        <Drawer.Screen
          name="MonthlyHoroscope"
          component={ChatScreen}
          initialParams={{ conversationId }}
          options={{
            headerTitle: 'This Month',
            headerTitleStyle: {
              color: 'white',
            },
            // Example of using a custom label component
            drawerLabel: DrawerLabel('This month'),
          }}
        />
      </Drawer.Navigator>
    </>
  )
}

export default MainNavigator
