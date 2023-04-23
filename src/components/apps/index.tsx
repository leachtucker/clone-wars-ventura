import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';
import AboutThisMac, { AboutThisMac_RND_CONFIG } from './AboutThisMac';

import aboutThisMacImg from '../../assets/minimized-apps/aboutThisMac.png';
import aboutThisEngineerImg from '../../assets/minimized-apps/aboutThisEngineer.png';

import AboutThisEngineer, {
  AboutThisEngineer_RND_CONFIG,
} from './AboutThisEngineer';

export type ApplicationName = 'aboutThisMac' | 'aboutThisEngineer';

export const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
  aboutThisEngineer: AboutThisEngineer,
} as const satisfies Record<
  ApplicationName,
  React.FC<ApplicationComponentProps>
>;

export const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
  aboutThisEngineer: AboutThisEngineer_RND_CONFIG,
} as const satisfies Record<
  ApplicationName,
  Partial<React.ComponentProps<typeof Rnd>>
>;

export const applicationMinimizedImgMap = {
  aboutThisMac: aboutThisMacImg,
  aboutThisEngineer: aboutThisEngineerImg,
} as const satisfies Record<ApplicationName, string>;
