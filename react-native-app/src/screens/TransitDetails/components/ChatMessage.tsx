import React from 'react'
import Box from 'components/Box'
import Text from 'components/Text'
import BlinkingCursor from './BlinkingCursor'

const avatarSize = 25
const marginLeftSize = 's'

const ChatMessage: React.FC<{
  messageRole: 'user' | 'assistant'
  messageContent?: string
}> = ({ messageRole, messageContent }) => {
  const renderMessageHeader = () => (
    <Box flexDirection="row">
      <Box marginLeft={marginLeftSize} />
      <Text variant="body">{messageRole}</Text>
    </Box>
  )
  const renderMessageBody = () => <Text variant="body">{messageContent}</Text>

  return (
    <Box>
      <Box marginBottom="xs">{renderMessageHeader()}</Box>
      <Box style={{ marginLeft: avatarSize + 8 }}>
        {messageContent ? renderMessageBody() : <BlinkingCursor />}
      </Box>
    </Box>
  )
}

export default ChatMessage
