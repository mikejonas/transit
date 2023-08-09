import React from 'react'
import { SB_URL } from '@env'
import Text from 'components/Text'

const Environmnet = () => {
  return (
    <Text color="textSecondary" fontSize={12}>
      (env: {SB_URL})
    </Text>
  )
}

export default Environmnet
