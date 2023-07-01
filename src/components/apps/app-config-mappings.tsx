import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';

import { IconConfig } from '../DesktopIcon';

import AboutThisMac from './AboutThisMac';
import aboutThisMacMinimizedImg from '../../assets/minimized-apps/aboutThisMac.png';

import AboutThisEngineer from './AboutThisEngineer';
import aboutThisEngineerMinimizedImg from '../../assets/minimized-apps/aboutThisEngineer.png';

import Chrome from './Chrome';
import chromeDockIconImg from '../../assets/icon-apps/chrome-icon.png';
import chromeMinimizedImg from '../../assets/minimized-apps/chrome.png';

import Terminal from './Terminal';
import terminalIconImg from '../../assets/icon-apps/terminal-icon.png';

import Finder from './Finder';
import finderIconImg from '../../assets/icon-apps/finder-icon.png';

export const AboutThisMac_RND_CONFIG = {
  default: {
    width: 280,
    height: 450,
    x: 250,
    y: 200,
  },
  enableResizing: false,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

export const AboutThisEngineer_RND_CONFIG = {
  default: {
    width: 280,
    height: 350,
    x: 250,
    y: 200,
  },
  enableResizing: false,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

export const Chrome_RND_CONFIG = {
  minHeight: 400,
  minWidth: 400,
  default: {
    width: 700,
    height: 700,
    ...getWindowStartingPosition(700, 700),
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const Terminal_RND_CONFIG = {
  minWidth: 160,
  minHeight: 100,
  default: {
    width: 570,
    height: 360,
    ...getWindowStartingPosition(570, 360),
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const FINDER_RND_CONFIG = {
  minWidth: 500,
  minHeight: 290,
  default: {
    width: 700,
    height: 380,
    ...getWindowStartingPosition(700, 380),
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

export type ApplicationName =
  | 'aboutThisMac'
  | 'aboutThisEngineer'
  | 'chrome'
  | 'terminal'
  | 'finder';

export const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
  aboutThisEngineer: AboutThisEngineer,
  chrome: Chrome,
  terminal: Terminal,
  finder: Finder,
} as const satisfies Record<
  ApplicationName,
  React.FC<ApplicationComponentProps>
>;

export const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
  aboutThisEngineer: AboutThisEngineer_RND_CONFIG,
  chrome: Chrome_RND_CONFIG,
  terminal: Terminal_RND_CONFIG,
  finder: FINDER_RND_CONFIG,
} as const satisfies Record<
  ApplicationName,
  Partial<React.ComponentProps<typeof Rnd>>
>;

export const applicationMinimizedImgMap = {
  aboutThisMac: aboutThisMacMinimizedImg,
  aboutThisEngineer: aboutThisEngineerMinimizedImg,
  chrome: chromeMinimizedImg,
  terminal: terminalIconImg,
  finder: finderIconImg,
} as const satisfies Record<ApplicationName, string>;

export const applicationDockIconMap = {
  chrome: chromeDockIconImg,
  terminal: terminalIconImg,
  finder: finderIconImg,
} as const satisfies Partial<Record<ApplicationName, string>>;

export const desktopIconsMaps = {
  chrome: {
    key: 'chrome',
    iconName: 'Chrome',
    imageSrc: chromeDockIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 10,
    },
  },

  terminal: {
    key: 'terminal',
    iconName: 'Terminal',
    imageSrc: terminalIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 100,
    },
  },

  finder: {
    key: 'finder',
    iconName: 'Finder',
    imageSrc: finderIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 190,
    },
  },
} as const satisfies Partial<Record<ApplicationName, IconConfig>>;

export function getWindowStartingPosition(width: number, height: number) {
  const windowCenterX = window.innerWidth / 2;
  const windowCenterY = window.innerHeight / 2;

  return {
    x: windowCenterX - width / 2,
    y: windowCenterY - 50 - height / 2,
  };
}
