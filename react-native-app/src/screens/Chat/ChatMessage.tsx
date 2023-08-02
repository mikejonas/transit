import React from 'react'
import { Image } from 'react-native'
import Box from 'components/Box'
import Text from 'components/Text'
import { Message } from '.'
import BlinkingCursor from './BlinkingCursor'
import { avatars } from './mockMessages'

const avatarSize = 25
const marginLeftSize = 's' // Corresponding to your theme spacing value

const ChatMessage: React.FC<{
  message: Message
  isCursorActive?: Boolean
}> = ({ message, isCursorActive }) => (
  <Box>
    <Box flexDirection="row" alignItems="center">
      <Image
        source={{ uri: avatars[message.role] }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
      />
      <Box marginLeft={marginLeftSize} />
      <Text variant="body">{message.role}</Text>
    </Box>
    <Box style={{ marginLeft: avatarSize + 8 }}>
      <Text variant="body">
        {message.content} {isCursorActive && <BlinkingCursor />}
      </Text>
    </Box>
  </Box>
)

export default ChatMessage
