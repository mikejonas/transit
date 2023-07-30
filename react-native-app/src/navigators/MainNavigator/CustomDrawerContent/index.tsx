import * as React from 'react'
import { SafeAreaView, View } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import supabaseClient from '@utils/supabaseClient'
import TextButton from '@components/TextButton'

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const handleSignOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
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
