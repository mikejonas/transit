import React, { useState, useEffect, useRef } from 'react'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import Textbutton from 'components/TextButton'
import { requests } from 'requests'
import Environment from './components/Environment'
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string>()
  const emailInputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus()
    }
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

  const renderInputs = () => {
    return (
      <>
        <Box mb="m">
          <Input
            placeholder="Email"
            ref={emailInputRef}
            value={email}
            autoCorrect={false}
            onChangeText={handleChangeEmail}
          />
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
      </>
    )
  }

  const renderButton = () => {
    const isDisabled = !email || !password
    return (
      <Button
        size="medium"
        disabled={isDisabled}
        title={isSignUp ? 'Sign up' : 'Sign in'}
        onPress={() => (isDisabled ? null : handleSubmit())}
        isLoading={loading}
      />
    )
  }

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0

  return (
    <Box flex={1} px="l">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'space-between' }}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <Box style={{ flex: 1, justifyContent: 'space-between' }}>
          <Box flex={1} justifyContent="center">
            <Box mb="xl">
              <Text textAlign="center" variant="sectionTitle">
                Continue with email
              </Text>
            </Box>
            {renderInputs()}
          </Box>
          <Box mb="m">
            <Box mb="s">{renderButton()}</Box>
            <Box>
              <Textbutton onPress={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
              </Textbutton>
            </Box>
          </Box>
        </Box>
      </KeyboardAvoidingView>
      <Box justifyContent="flex-end" alignItems="center" mb="m">
        <Environment />
      </Box>
    </Box>
  )
}

export default Auth
