import { DefaultTheme } from 'styled-components';

export type ThemeMapping = {
  colors: {
    primary: string;
    background: string;
    backgroundTransparent: string;
    selection: string;
    selectionContrast: string;
    grey: string;
    transparentGrey: string;
  };
};

const colors = {
  white: 'rgb(243, 235, 235)',
  black: 'rgb(0, 0, 0)',
  almostBlack: 'rgb(50, 40, 39)',
  blue: 'rgb(17, 107, 210)',
  grey: 'rgb(139, 140, 151)',
  transparentGrey: 'rgba(139, 140, 151, 0.3)',
} as const;

const light: DefaultTheme = {
  colors: {
    primary: colors.black,
    background: colors.white,
    backgroundTransparent: 'rgba(243, 235, 235, 0.3)',
    selection: colors.blue,
    selectionContrast: colors.white,
    grey: colors.grey,
    transparentGrey: colors.transparentGrey,
  },
};

const dark: DefaultTheme = {
  colors: {
    primary: colors.white,
    background: colors.almostBlack,
    backgroundTransparent: 'rgba(50, 40, 39, 0.3)',
    selection: colors.blue,
    selectionContrast: colors.white,
    grey: colors.grey,
    transparentGrey: colors.transparentGrey,
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
