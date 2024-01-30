import { StatusBar } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Text from 'components/Text'
import { darkTheme } from 'theme/restyle'
import CustomDrawerContent from './CustomDrawerContent'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { RouteProp } from '@react-navigation/native'
import HomeNavigator from 'navigators/HomeNavigator'

export type MainAppDrawerNavigatorProps = {
  HomeNavigator: undefined
}

const Drawer = createDrawerNavigator<MainAppDrawerNavigatorProps>()

// todo: better handle how to render the label by extracting it its own component
// todo: better handle font sizes across the app
const renderLabel = ({ focused, label }: { focused: boolean; label: string }) => (
  <Text color="text" fontSize={15} fontWeight={focused ? 'bold' : 'normal'}>
    {label}
  </Text>
)
const DrawerLabel = (label: string) => (props: any) => renderLabel({ ...props, label })

export type MainAppDrawerNavigationProps = DrawerNavigationProp<
  MainAppDrawerNavigatorProps,
  'HomeNavigator'
>
export type MainAppDrawerNavigatoinRouteProps = RouteProp<
  MainAppDrawerNavigatorProps,
  'HomeNavigator'
>

const MainAppDrawerNavigator = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Drawer.Navigator
        initialRouteName="HomeNavigator"
        screenOptions={{
          drawerActiveTintColor: darkTheme.colors.title,
          drawerInactiveTintColor: darkTheme.colors.text,
          drawerStyle: {
            backgroundColor: darkTheme.colors.background,
          },
          swipeEdgeWidth: 200,
          headerStyle: {
            backgroundColor: darkTheme.colors.background,
            borderBottomWidth: 0,
            shadowOpacity: 0, // removes the bottom border
            elevation: 0, // removes shadow on Android
          },
          headerTintColor: darkTheme.colors.title,
        }}
        drawerContent={CustomDrawerContent}>
        <Drawer.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{
            headerShown: false,
            headerTitle: 'transit',
            headerTitleStyle: {
              color: 'white',
              fontSize: 26,
              fontWeight: 'normal',
            },
            drawerLabel: DrawerLabel('Conversations'),
          }}
        />
      </Drawer.Navigator>
    </>
  )
}

export default MainAppDrawerNavigator
