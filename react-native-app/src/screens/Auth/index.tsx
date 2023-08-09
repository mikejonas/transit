import React, { useEffect, useState } from 'react'
import Analytics from 'appcenter-analytics'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import Textbutton from 'components/TextButton'
import { requests } from 'requests'
import Environment from './components/Environment'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string>()
  useEffect(() => {
    Analytics.trackEvent('Login screen landed')
  }, [])
  const handleSubmit = async () => {
    setLoading(true)
    if (isSignUp) {
      const { error } = await requests.auth.signUp({
        email,
        password,
      })
      if (error) {
        setAuthError(error.message)
        console.log(error)
      }
    } else {
      const { error } = await requests.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setAuthError(error.message)
        console.log(error)
      }
    }
    setLoading(false)
  }

  const handleChangePassword = async (value: string) => {
    setPassword(value)
    authError && setAuthError(undefined)
  }
  const handleChangeEmail = async (value: string) => {
    setEmail(value)
    authError && setAuthError(undefined)
  }

  return (
    <Box flex={1} justifyContent="space-between" alignItems="center" padding="xl">
      <Box flex={1} />
      <Box width="100%" alignItems="stretch">
        <Box mb="s">
          <Input placeholder="Email" value={email} onChangeText={handleChangeEmail} />
        </Box>
        <Box mb="m">
          <Input
            placeholder="Password"
            value={password}
            onChangeText={handleChangePassword}
            secureTextEntry
          />
        </Box>
        {authError && (
          <Box mb="m">
            <Text fontSize={14} color="error" textAlign="center">
              {authError}
            </Text>
          </Box>
        )}
        <Box mb="m">
          <Button
            size="medium"
            title={isSignUp ? 'Sign up' : 'Sign in'}
            onPress={handleSubmit}
            isLoading={loading}
          />
        </Box>
        <Box>
          <Textbutton onPress={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
          </Textbutton>
        </Box>
      </Box>
      <Box width="100%" flex={1} justifyContent="flex-end" alignItems="center" mb="m">
        <Environment />
      </Box>
    </Box>
  )
}

export default Auth
