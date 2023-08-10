import React from 'react'
import { APP_ENV } from '@env'
import Text from 'components/Text'

/**
 * Simply prints the environment, useful for debugging
 */
const Environmnet = () => {
  return (
    <Text color="textSecondary" fontSize={12}>
      (env: {APP_ENV})
    </Text>
  )
}

export default Environmnet
