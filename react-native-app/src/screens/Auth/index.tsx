import React, { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { StyleSheet } from 'react-native'
import Box from '../../components/Box'
import Button from '../../components/Button'
import Input from '../../components/Input'
import Text from '../../components/Text'
import supabaseClient from '../../utils/supabaseClient'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

type StackNavigatorParams = {
  Auth: undefined
  MainNavigator: undefined
}

type AuthScreenNavigationProp = StackNavigationProp<StackNavigatorParams, 'Auth'>

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [session, setSession] = useState<Session | null>(null)

  const navigation = useNavigation<AuthScreenNavigationProp>()

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.log(error)
    } else {
      console.log('Successfully logged in')
      navigation.navigate('MainNavigator')
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
        <Text>{session?.user.id}</Text>
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
