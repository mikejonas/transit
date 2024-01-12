import { createTheme } from '@shopify/restyle'

const palette = {
  softBlue: '#444b50',
  softBlueLight: '#bdc8d0',
  vibrantBlue: '#7289DA',
  vibrantPurple: '#8530C8',
  black: '#000',
  gray1: '#161616',
  gray2: '#333',
  gray3: '#555',
  gray4: '#777',
  gray5: '#999',
  gray6: '#bbb',
  gray7: '#ccc',
  gray8: '#ddd',
  gray9: '#eee',
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
    lightBorder: '',
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
    background: palette.gray1,
    cardPrimaryBackground: palette.gray1,
    cardSecondaryBackground: palette.softBlue,
    title: palette.white,
    text: palette.white,
    textSecondary: palette.lightGrey,
    error: palette.red,
    buttonPurple: palette.vibrantPurple,
    lightBorder: palette.gray6,
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
    lightBorder: palette.gray6,
  },
})

export type Theme = typeof darkTheme
