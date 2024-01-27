import React from 'react'
import Box from 'components/Box'
import CustomHeader from 'screens/Conversation/CustomHeader'

// @TODO - put more of the animation logic in here to remove it from HoroscopeCard
const FakeNewChatSheet: React.FC = () => {
  return (
    <Box mt="l" opacity={0.7}>
      <CustomHeader title={'New chat'} />
    </Box>
  )
}

export default FakeNewChatSheet
