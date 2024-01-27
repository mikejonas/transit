import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import App from './App'

describe('<App />', () => {
  it('renders <RootNavigator />', async () => {
    const { queryByTestId } = render(<App />)

    await waitFor(() => {
      expect(queryByTestId('RootNavigator')).toBeTruthy()
    })
  })
})
