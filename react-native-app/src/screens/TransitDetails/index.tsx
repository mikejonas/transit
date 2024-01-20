import React from 'react'
import Box from 'components/Box'
import TransitGrid from './components/TransitGrid'

/**
 * This is a rough hacked together version of chat ui. It would need to be cleaned up to build upon
 */

const ChatScreen: React.FC = () => {
  return (
    <Box mt="m">
      <Box m="m">
        <TransitGrid />
      </Box>
    </Box>
  )
}

export default ChatScreen
