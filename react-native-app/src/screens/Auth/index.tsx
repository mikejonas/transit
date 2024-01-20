import React, { useState } from 'react'
import Box from 'components/Box'
import Button from 'components/Button'
import Text from 'components/Text'
import Textbutton from 'components/TextButton'
import { requests } from 'requests'
import { Alert, Dimensions, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationProps } from 'navigators/AuthNavigator'
import GoogleLogo from '../../../assets/google-logo.svg'
import AppleLogo from '../../../assets/apple-logo.svg'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const aspectRatio = 1572 / 1720 // Aspect ratio of your image
const imageHeight = screenWidth / aspectRatio
const contentHeight = screenHeight - imageHeight

const Auth = () => {
  const navigation = useNavigation<AuthNavigationProps>()
  const triggerNotImplementedAlert = () => {
    Alert.alert('Not implemented', 'Continue with email for now', [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ])
  }

  const renderLogoSection = () => {
    return (
      <Box alignItems="center">
        <Image
          source={require('../../../assets/logo-white.png')}
          style={{ height: 64, width: 64 }}
        />
        <Text fontSize={48} lineHeight={48} textAlign="center" fontWeight="400">
          transit
        </Text>
        <Text lineHeight={28} textAlign="center" fontWeight="200" letterSpacing={4}>
          converse with the stars
        </Text>
      </Box>
    )
  }

  const renderLoginButtons = () => {
    return (
      <>
        <Box mb="m">
          <Button
            icon={<AppleLogo height={14} width={14} />}
            size="medium"
            title="Continue with Apple"
            onPress={triggerNotImplementedAlert}
          />
        </Box>
        <Box mb="m">
          <Button
            icon={<GoogleLogo height={14} width={14} />}
            size="medium"
            title="Continue with Google"
            onPress={triggerNotImplementedAlert}
          />
        </Box>
        <Box mb="m">
          <Button
            size="medium"
            title="Continue with email"
            varient="secondary"
            onPress={() => navigation.navigate('SignUpWithEmail')}
          />
        </Box>
      </>
    )
  }

  const renderPrivacyAndTerms = () => {
    return (
      <Box flexDirection="row" alignItems="center" justifyContent="center">
        <Textbutton onPress={() => console.log('Privacy Policy')}>Privacy Policy</Textbutton>
        <Box width={30} />
        <Textbutton onPress={() => console.log('Terms of Service')}>Terms of Service</Textbutton>
      </Box>
    )
  }

  return (
    <Box>
      <Image
        source={require('../../../assets/login-screen-graphic.png')}
        style={{ width: screenWidth, height: imageHeight }}
        resizeMode="cover"
      />
      <Box style={{ height: contentHeight }} mx="l">
        <Box style={{ marginTop: -48 }} flex={1}>
          <Box>{renderLogoSection()}</Box>
          <Box justifyContent="space-evenly" flex={1}>
            <Box>{renderLoginButtons()}</Box>
            <Box>{renderPrivacyAndTerms()}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Auth
