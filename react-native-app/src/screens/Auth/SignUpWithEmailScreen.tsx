import React, { useState, useEffect, useRef } from 'react'
import Box from 'components/Box'
import Button from 'components/Button'
import Input from 'components/Input'
import Text from 'components/Text'
import Textbutton from 'components/TextButton'
import { requests } from 'requests'
import Environment from './components/Environment'
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { useMutation } from '@tanstack/react-query'

const useSignUpWithEmail = () =>
  useMutation({
    mutationFn: requests.auth.signUp,
  })

const useSignInWithEmail = () =>
  useMutation({
    mutationFn: requests.auth.signInWithPassword,
  })

const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string>()
  const emailInputRef = useRef<TextInput>(null)

  const signUpMutation = useSignUpWithEmail()
  const signInMutation = useSignInWithEmail()

  const isAuthenticating = signUpMutation.isPending || signInMutation.isPending

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus()
  }, [])

  const handleSubmit = () => {
    const credentials = { email, password }
    if (isSignUp) {
      signUpMutation.mutate(credentials, {
        onError: error => {
          setAuthError(error.message)
        },
      })
    } else {
      signInMutation.mutate(credentials, {
        onError: error => {
          setAuthError(error.message)
        },
      })
    }
  }

  const handleChangePassword = (value: string) => {
    setPassword(value)
    setAuthError(undefined)
  }

  const handleChangeEmail = (value: string) => {
    setEmail(value)
    setAuthError(undefined)
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

  const renderSubmitButton = () => {
    const isDisabled = !email || !password
    return (
      <Button
        size="medium"
        disabled={isDisabled}
        title={isSignUp ? 'Sign up' : 'Sign in'}
        onPress={() => (isDisabled ? null : handleSubmit())}
        isLoading={isAuthenticating}
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
            <Box mb="s">{renderSubmitButton()}</Box>
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
