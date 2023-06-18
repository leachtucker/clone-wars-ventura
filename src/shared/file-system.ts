import type { ApplicationName } from '../components/apps';

import chromeIconImg from '../assets/icon-apps/chrome-icon.png';
import terminalIconImg from '../assets/icon-apps/terminal-icon.png';

type BaseDirectoryEntry = { type: 'file' | 'app'; name: string; icon: string };

export type ApplicationDirectoryEntry = {
  type: 'app';
  appName: ApplicationName;
} & BaseDirectoryEntry;

export type FileDirectoryEntry = {
  type: 'file';
  fileExtension: 'string';
} & BaseDirectoryEntry;

export const FILE_SYSTEM_DIRECTORY = {
  home: {
    desktop: {
      chrome: {
        name: 'Chrome',
        icon: chromeIconImg,
        type: 'app',
        appName: 'chrome',
      },
      terminal: {
        name: 'Terminal',
        icon: terminalIconImg,
        appName: 'terminal',
        type: 'app',
      },
    },

    downloads: {
      helloworld: {
        type: 'file',
        fileExtension: 'js',
        name: 'helloworld',
        // Todo: find blank page icon for generic files
        icon: 'ds',
      },
    },
  },
} as const;
