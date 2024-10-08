import React from 'react'
import Text from 'components/Text'
const environment = process.env.EXPO_PUBLIC_APP_ENV // 'prod' or 'local'
/**
 * Simply prints the environment, useful for debugging
 */
const Environmnet = () => {
  return (
    <Text color="textSecondary" fontSize={12}>
      (env: {environment})
    </Text>
  )
}

export default Environmnet
