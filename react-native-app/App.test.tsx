import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import App from './App'

describe('<App />', () => {
  it('renders <AppNavigator />', async () => {
    const { queryByTestId } = render(<App />)

    await waitFor(() => {
      expect(queryByTestId('AppNavigator')).toBeTruthy()
      expect(queryByTestId('TestNavigator')).toBeNull() // Ensure this testID is in TestNavigator if you want to check for its absence
    })
  })
})
