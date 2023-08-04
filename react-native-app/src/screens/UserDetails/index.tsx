import React, { useState } from 'react'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import { requests } from 'requests'

const UserDetails: React.FC = () => {
  const handleSignOut = async () => {
    await requests.auth.signOut()
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="m">
      <Box mb="l">
        <Text>Todo: Create user details form.</Text>
      </Box>
      <Box mb="l">
        <Text>Log out and log in with a user that has details.</Text>
      </Box>
      <TextButton onPress={() => handleSignOut()}>logout</TextButton>
    </Box>
  )
}

export default UserDetails
