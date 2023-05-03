import { DefaultTheme } from 'styled-components';

export type ThemeMapping = {
  name: 'light' | 'dark';
  colors: {
    white: string;
    black: string;
    almostBlack: string;
    blue: string;
    grey: string;
    transparentGrey: string;
    highlightBlue: string;

    primary: string;
    background: string;
    backgroundTransparent: string;
    selection: string;
    selectionContrast: string;

    chromeTopBarBackground: string;
    chromeTopBarTabBackground: string;
  };
};

const colors = {
  white: 'rgb(243, 235, 235)',
  black: 'rgb(0, 0, 0)',
  almostBlack: 'rgb(50, 40, 39)',
  blue: 'rgb(17, 107, 210)',
  grey: 'rgb(139, 140, 151)',
  transparentGrey: 'rgba(139, 140, 151, 0.3)',
  highlightBlue: `rgba(0, 122, 255)`,
  chromeGrey: 'rgb(227, 227, 227)',
  chromeBlack: 'rgb(33, 33, 36)',
  chromeDarkGrey: 'rgb(56, 56, 56)',
} as const;

const light: DefaultTheme = {
  name: 'light',
  colors: {
    ...colors,
    primary: colors.black,
    background: colors.white,
    backgroundTransparent: 'rgba(243, 235, 235, 0.3)',
    selection: colors.blue,
    selectionContrast: colors.white,
    chromeTopBarBackground: colors.chromeGrey,
    chromeTopBarTabBackground: colors.white,
  },
};

const dark: DefaultTheme = {
  name: 'dark',
  colors: {
    ...colors,
    primary: colors.white,
    background: colors.almostBlack,
    backgroundTransparent: 'rgba(50, 40, 39, 0.3)',
    selection: colors.blue,
    selectionContrast: colors.white,
    chromeTopBarBackground: colors.chromeBlack,
    chromeTopBarTabBackground: colors.chromeDarkGrey,
  },
};

const themes = {
  light,
  dark,
};

export default themes;

export type ThemeName = keyof typeof themes;

export function getThemeMapping(themeName: keyof typeof themes) {
  return themes[themeName];
}
