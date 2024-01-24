import * as React from 'react'
import { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Text from 'components/Text'
import { StackNavigatorParams } from 'navigators/AppNavigator'
import { requests } from 'requests'
import Main from 'screens/Main'
import AskDemo from './screens/AskDemo'
import { darkTheme } from 'theme/restyle'
import CustomDrawerContent from './CustomDrawerContent'
import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

export type DrawerNavigatorProps = {
  Main: { conversationId?: number }
}

const Drawer = createDrawerNavigator<DrawerNavigatorProps>()

// todo: better handle how to render the label by extracting it its own component
// todo: better handle font sizes across the app
const renderLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text color="text" fontSize={15} fontWeight={focused ? 'bold' : 'normal'}>
    {label}
  </Text>
)
const DrawerLabel = (label: string) => (props: any) => renderLabel({ ...props, label })

export type MainNavigationProps = StackNavigationProp<StackNavigatorParams, 'MainNavigator'>
export type MainRouteProps = RouteProp<DrawerNavigatorProps, 'Main'>

const MainNavigator = () => {
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
    <View testID="TestNavigator" style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <StatusBar barStyle="light-content" />
        <Drawer.Navigator
          initialRouteName="Main"
          screenOptions={{
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
            name="Main"
            // component={Main}
            component={AskDemo}
            initialParams={{ conversationId }}
            options={{
              headerTitle: 'transit',
              headerTitleStyle: {
                color: 'white',
                fontSize: 26,
                fontWeight: 'normal',
              },
              drawerLabel: DrawerLabel('Transit'),
            }}
          />
        </Drawer.Navigator>
      </BottomSheetModalProvider>
    </View>
  )
}

export default MainNavigator
