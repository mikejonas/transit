import { useEffect, useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer'
import TextButton from 'components/TextButton'
import { requests } from 'requests'
import { useDrawerStatus } from '@react-navigation/drawer'
import Box from 'components/Box'
import { useNavigation } from '@react-navigation/native'
import { HomeNavigationProps } from 'navigators/HomeNavigator'
import ConversationButton from './ConversationButton'
type Conversation = { conversation_id: number }

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const drawerStatus = useDrawerStatus()
  const navigation = useNavigation<HomeNavigationProps>()

  useEffect(() => {
    if (drawerStatus === 'open') {
      getOrCreateConversation()
    }
  }, [drawerStatus])

  const getOrCreateConversation = async () => {
    const { data, error } = await requests.generated.getConversations()
    if (data) {
      setConversations(data)
    }

    if (error) console.log({ error })
  }

  const handleSignOut = async () => {
    await requests.auth.signOut()
  }

  const renderConversation = (conversation: Conversation) => {
    return (
      <Box key={conversation.conversation_id} marginHorizontal="m" mb="s">
        <ConversationButton
          onPress={() =>
            navigation.navigate('ConversationThread', {
              conversationId: conversation.conversation_id,
            })
          }>
          Conversation {conversation.conversation_id}
        </ConversationButton>
      </Box>
    )
  }

  const renderConversations = () => {
    return conversations.map(conversation => renderConversation(conversation))
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        {renderConversations()}
      </DrawerContentScrollView>
      <View>
        <TextButton onPress={() => handleSignOut()}>logout</TextButton>
      </View>
    </SafeAreaView>
  )
}

export default CustomDrawerContent
