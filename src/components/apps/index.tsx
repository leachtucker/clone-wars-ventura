import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';

import AboutThisMac, { AboutThisMac_RND_CONFIG } from './AboutThisMac';
import aboutThisMacImg from '../../assets/minimized-apps/aboutThisMac.png';

import AboutThisEngineer, {
  AboutThisEngineer_RND_CONFIG,
} from './AboutThisEngineer';
import aboutThisEngineerImg from '../../assets/minimized-apps/aboutThisEngineer.png';

import Chrome, { Chrome_RND_CONFIG } from './Chrome';
import chromeDockIconImg from '../../assets/chrome-icon.png';

export type ApplicationName = 'aboutThisMac' | 'aboutThisEngineer' | 'chrome';

export const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
  aboutThisEngineer: AboutThisEngineer,
  chrome: Chrome,
} as const satisfies Record<
  ApplicationName,
  React.FC<ApplicationComponentProps>
>;

export const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
  aboutThisEngineer: AboutThisEngineer_RND_CONFIG,
  chrome: Chrome_RND_CONFIG,
} as const satisfies Record<
  ApplicationName,
  Partial<React.ComponentProps<typeof Rnd>>
>;

export const applicationMinimizedImgMap = {
  aboutThisMac: aboutThisMacImg,
  aboutThisEngineer: aboutThisEngineerImg,
  chrome: aboutThisEngineerImg,
} as const satisfies Record<ApplicationName, string>;

export const applicationDockIconMap = {
  chrome: chromeDockIconImg,
} as const satisfies Partial<Record<ApplicationName, string>>;
