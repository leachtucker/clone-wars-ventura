import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';

import { IconConfig } from '../DesktopIcon';

import AboutThisMac, { AboutThisMac_RND_CONFIG } from './AboutThisMac';
import aboutThisMacMinimizedImg from '../../assets/minimized-apps/aboutThisMac.png';

import AboutThisEngineer, {
  AboutThisEngineer_RND_CONFIG,
} from './AboutThisEngineer';
import aboutThisEngineerMinimizedImg from '../../assets/minimized-apps/aboutThisEngineer.png';

import Chrome, { Chrome_RND_CONFIG } from './Chrome';
import chromeDockIconImg from '../../assets/icon-apps/chrome-icon.png';
import chromeMinimizedImg from '../../assets/minimized-apps/chrome.png';

import Terminal, { Terminal_RND_CONFIG } from './Terminal';
import terminalIconImg from '../../assets/icon-apps/terminal-icon.png';
import Finder, { FINDER_RND_CONFIG } from './Finder';

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
  // todo: update img
  finder: terminalIconImg,
} as const satisfies Record<ApplicationName, string>;

export const applicationDockIconMap = {
  chrome: chromeDockIconImg,
  terminal: terminalIconImg,
  // todo: update img
  finder: terminalIconImg,
} as const satisfies Partial<Record<ApplicationName, string>>;

export const desktopIconsMaps = {
  chrome: {
    iconName: 'Chrome',
    imageSrc: chromeDockIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 10,
    },
  },

  terminal: {
    iconName: 'Terminal',
    imageSrc: terminalIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 100,
    },
  },

  finder: {
    iconName: 'Finder',
    // todo: update img
    imageSrc: terminalIconImg,
    position: {
      x: window.innerWidth - 80,
      y: 190,
    },
  },
} as const satisfies Partial<Record<ApplicationName, IconConfig>>;
