import { DefaultTheme } from 'styled-components';

export type ThemeMapping = {
  colors: {
    primary: string;
    background: string;
    backgroundTransparent: string;
  };
};

const light: DefaultTheme = {
  colors: {
    primary: 'black',
    background: 'rgb(243, 235, 235)',
    backgroundTransparent: 'rgba(243, 235, 235, 0.3)',
  },
};

const dark: DefaultTheme = {
  colors: {
    primary: 'white',
    background: 'rgb(50, 40, 39)',
    backgroundTransparent: 'rgba(50, 40, 39, 0.3)',
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
