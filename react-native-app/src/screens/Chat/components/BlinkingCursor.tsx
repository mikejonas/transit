import React, { useState, useEffect } from 'react'
import Box from 'components/Box'

const BlinkingCursor = () => {
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowCursor(prevShow => !prevShow)
    }, 500)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Box
      height={20}
      width={9}
      backgroundColor={showCursor ? 'cardSecondaryBackground' : undefined}
    />
  )
}

export default BlinkingCursor
