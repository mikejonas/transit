import React from 'react'
import { ActivityIndicator } from 'react-native'
import Box from '../../components/Box'

const InitialLoadingScreen = () => (
  <Box backgroundColor="background" flex={1} justifyContent="center" alignItems="center">
    <ActivityIndicator size="small" color="#fff" />
  </Box>
)

export default InitialLoadingScreen
