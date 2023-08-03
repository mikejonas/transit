import * as React from 'react'
import { SafeAreaView, View } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import TextButton from 'components/TextButton'
import { requests } from 'requests'

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const handleSignOut = async () => {
    const { error } = await requests.auth.signOut()
    if (error) {
      console.log(error)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <TextButton onPress={() => handleSignOut()}>logout</TextButton>
      </View>
    </SafeAreaView>
  )
}

export default CustomDrawerContent
