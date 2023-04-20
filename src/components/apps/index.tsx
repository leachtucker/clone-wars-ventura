import { Rnd } from 'react-rnd';
import { ApplicationComponentProps } from '../AppWindow';
import AboutThisMac, { AboutThisMac_RND_CONFIG } from './AboutThisMac';

export type ApplicationName = 'aboutThisMac';

export const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
} as const satisfies Record<
  ApplicationName,
  React.FC<ApplicationComponentProps>
>;

export const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
} as const satisfies Record<
  ApplicationName,
  Partial<React.ComponentProps<typeof Rnd>>
>;
