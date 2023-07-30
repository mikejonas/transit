import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Box from '../../components/Box'
import Button from '../../components/Button'
import Input from '../../components/Input'
import supabaseClient from '../../utils/supabaseClient'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="m">
      <Box width={300} alignItems="stretch">
        <Box mb="s">
          <Input placeholder="Email" value={email} onChangeText={setEmail} />
        </Box>
        <Box mb="m">
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </Box>
        <Box mb="m">
          <Button size="medium" title="Log in" onPress={handleSubmit} isLoading={loading} />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
})

export default Auth
