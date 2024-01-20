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
  red: '#ec7373',
}

// default theme structure. Modify colors in the exported themes below
const baseTheme = createTheme({
  colors: {
    background: '',
    cardSecondaryBackground: '',
    title: '',
    text: '',
    textSecondary: '', // light graey
    error: '',
    lightBorder: '',
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
    defaults: { fontSize: 15, lineHeight: 22, color: "text" }, // body
    header: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'title',
    },
    // tabNav: { fontSize: '10px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // smallCaption: { fontSize: '11px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // legalFootnote: { fontSize: '11px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // caption: { fontSize: '13px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // smallContent: { fontSize: '13px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    body: { fontSize: 15, lineHeight: 22 },
    sectionTitle: { fontSize: 20},
    // listSecondary: { fontSize: '15px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // bodyLarge: { fontSize: '17px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // listPrimary: { fontSize: '17px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // navbar: { fontSize: '17px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // button: { fontSize: '17px', fontFamily: 'SFText', letterSpacing: 'normal', lineHeight: 'normal' },
    // smallTitle: { fontSize: '19px', fontFamily: 'SFDisplay', letterSpacing: 'normal', lineHeight: 'normal' },
    // bannerTitle: { fontSize: '24px', fontFamily: 'SFDisplay', letterSpacing: 'normal', lineHeight: 'normal' },
    // bigTitle: { fontSize: '28px', fontFamily: 'SFDisplay', letterSpacing: 'normal', lineHeight: 'normal' },
    // headerTitle: { fontSize: '34px', fontFamily: 'SFDisplay', letterSpacing: 'normal', lineHeight: 'normal' },
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
      backgroundColor: 'background',
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
    cardSecondaryBackground: palette.softBlue,
    title: palette.white,
    text: palette.white,
    textSecondary: palette.lightGrey,
    error: palette.red,
    lightBorder: palette.gray6,
  },
})

export const lightTheme = createTheme({
  ...darkTheme,
  colors: {
    background: palette.lightGrey,
    cardSecondaryBackground: palette.softBlueLight,
    title: palette.black,
    text: palette.black,
    textSecondary: palette.black,
    error: palette.red,
    lightBorder: palette.gray6,
  },
})

export type Theme = typeof darkTheme
