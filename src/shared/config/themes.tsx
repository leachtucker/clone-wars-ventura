import { DefaultTheme } from 'styled-components';
import Color from 'color';

export type ThemeMapping = {
  name: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundTransparent: string;
    selection: string;
    selectionContrast: string;

    chromeTopBarBackground: string;
    chromeTopBarTabBackground: string;

    terminalTopBarBackground: string;
    terminalBackground: string;

    finderSideBarSelection: string;
    finderTopBarBackground: string;
    finderBackground: string;
    finderTextColor: string;
  } & typeof colors;
};

const colors = {
  white: 'rgb(243, 235, 235)',
  black: 'rgb(0, 0, 0)',
  almostBlack: 'rgb(50, 40, 39)',
  almostWhite: 'rgb(222, 222, 222)',
  blue: 'rgb(17, 107, 210)',
  grey: 'rgb(139, 140, 151)',
  transparentGrey: 'rgba(139, 140, 151, 0.3)',
  highlightBlue: `rgb(0, 122, 255)`,
  chromeGrey: 'rgb(227, 227, 227)',
  chromeBlack: 'rgb(33, 33, 36)',
  chromeDarkGrey: 'rgb(56, 56, 56)',
  terminalAlmostWhite: 'rgb(249, 240, 237)',
  terminalAlmostBlack: 'rgb(30, 30, 30)',
  neonGreen: 'rgb(57, 192, 38)',
  cyan: 'rgb(56, 185, 199)',
} as const;

const light: DefaultTheme = {
  name: 'light',
  colors: {
    ...colors,
    primary: colors.black,
    secondary: colors.almostBlack,
    background: colors.white,
    backgroundTransparent: Color(colors.white).alpha(0.3).toString(),
    selection: colors.blue,
    selectionContrast: colors.white,
    chromeTopBarBackground: colors.chromeGrey,
    chromeTopBarTabBackground: colors.white,
    terminalTopBarBackground: colors.almostWhite,
    terminalBackground: colors.terminalAlmostWhite,
    finderSideBarSelection: Color(colors.almostBlack).alpha(0.15).toString(),
    finderTopBarBackground: 'rgb(249, 243, 241)',
    finderBackground: 'rgb(255, 255, 255)',
    finderTextColor: 'rgb(75, 72, 72)',
  },
};

const dark: DefaultTheme = {
  name: 'dark',
  colors: {
    ...colors,
    primary: colors.white,
    secondary: colors.almostWhite,
    background: colors.almostBlack,
    backgroundTransparent: Color(colors.almostBlack).alpha(0.3).toString(),
    selection: colors.blue,
    selectionContrast: colors.white,
    chromeTopBarBackground: colors.chromeBlack,
    chromeTopBarTabBackground: colors.chromeDarkGrey,
    terminalTopBarBackground: colors.almostBlack,
    terminalBackground: colors.terminalAlmostBlack,
    finderSideBarSelection: Color(colors.almostWhite).alpha(0.15).toString(),
    finderTopBarBackground: 'rgb(63, 53, 50)',
    finderBackground: 'rgb(47, 32, 27)',
    finderTextColor: 'rgb(239, 236, 234)',
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
