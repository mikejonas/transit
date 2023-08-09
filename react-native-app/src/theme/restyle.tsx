import { createTheme } from '@shopify/restyle'

const palette = {
  softBlue: '#444b50',
  softBlueLight: '#bdc8d0',
  vibrantBlue: '#7289DA',
  vibrantPurple: '#8530C8',
  black: '#000',
  charcoal: '#1c1c22',
  darkGrey: '#333333',
  mediumGrey: '#666',
  lightGrey: '#999',
  offWhite: '#ccc',
  whiteSmoke: '#f5f5f5',
  white: '#FFFFFF',
  red: '#ff5353',
}

// default theme structure. Modify colors in the exported themes below
const baseTheme = createTheme({
  colors: {
    background: '',
    cardPrimaryBackground: '',
    cardSecondaryBackground: '',
    title: '',
    text: '',
    textSecondary: '', // light graey
    error: '',
    buttonPurple: '',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    defaults: {
      fontSize: 17,
      color: 'text',
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'title',
    },
    body: {
      fontSize: 17,
      lineHeight: 24,
      color: 'text',
    },
    error: {
      fontSize: 12,
      color: 'error',
    },
  },
  cardVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 10,
    },
    primary: {
      backgroundColor: 'cardPrimaryBackground',
    },
    secondary: {
      backgroundColor: 'cardSecondaryBackground',
    },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    background: palette.charcoal,
    cardPrimaryBackground: palette.charcoal,
    cardSecondaryBackground: palette.softBlue,
    title: palette.white,
    text: palette.white,
    textSecondary: palette.lightGrey,
    error: palette.red,
    buttonPurple: palette.vibrantPurple,
  },
})

export const lightTheme = createTheme({
  ...darkTheme,
  colors: {
    background: palette.lightGrey,
    cardPrimaryBackground: palette.white,
    cardSecondaryBackground: palette.softBlueLight,
    title: palette.black,
    text: palette.black,
    textSecondary: palette.black,
    error: palette.red,
    buttonPurple: palette.vibrantPurple,
  },
})

export type Theme = typeof darkTheme
