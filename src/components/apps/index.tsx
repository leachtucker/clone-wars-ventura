import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';

import AboutThisMac, { AboutThisMac_RND_CONFIG } from './AboutThisMac';
import aboutThisMacMinimizedImg from '../../assets/minimized-apps/aboutThisMac.png';

import AboutThisEngineer, {
  AboutThisEngineer_RND_CONFIG,
} from './AboutThisEngineer';
import aboutThisEngineerMinimizedImg from '../../assets/minimized-apps/aboutThisEngineer.png';

import Chrome, { Chrome_RND_CONFIG } from './Chrome';
import chromeDockIconImg from '../../assets/chrome-icon.png';
import chromeMinimizedImg from '../../assets/minimized-apps/chrome.png';
import { IconConfig } from '../DesktopIcon';
import Terminal, { Terminal_RND_CONFIG } from './Terminal';

export type ApplicationName =
  | 'aboutThisMac'
  | 'aboutThisEngineer'
  | 'chrome'
  | 'terminal';

export const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
  aboutThisEngineer: AboutThisEngineer,
  chrome: Chrome,
  terminal: Terminal,
} as const satisfies Record<
  ApplicationName,
  React.FC<ApplicationComponentProps>
>;

export const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
  aboutThisEngineer: AboutThisEngineer_RND_CONFIG,
  chrome: Chrome_RND_CONFIG,
  terminal: Terminal_RND_CONFIG,
} as const satisfies Record<
  ApplicationName,
  Partial<React.ComponentProps<typeof Rnd>>
>;

export const applicationMinimizedImgMap = {
  aboutThisMac: aboutThisMacMinimizedImg,
  aboutThisEngineer: aboutThisEngineerMinimizedImg,
  chrome: chromeMinimizedImg,
  // Todo: update minimized img
  terminal: chromeMinimizedImg,
} as const satisfies Record<ApplicationName, string>;

export const applicationDockIconMap = {
  chrome: chromeDockIconImg,
  // Todo: update minimized img
  terminal: chromeDockIconImg,
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
} as const satisfies Partial<Record<ApplicationName, IconConfig>>;
