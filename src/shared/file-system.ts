import type { ApplicationName } from '../components/apps/app-config-mappings';

import chromeIconImg from '../assets/icon-apps/chrome-icon.png';
import terminalIconImg from '../assets/icon-apps/terminal-icon.png';
import textIconImg from '../assets/text-icon.png';

type BaseDirectoryEntry = { type: 'file' | 'app'; name: string; icon: string };

export type ApplicationDirectoryEntry = {
  type: 'app';
  appName: ApplicationName;
} & BaseDirectoryEntry;

export type FileDirectoryEntry = {
  type: 'file';
  fileExtension?: string;
  content: string;
} & BaseDirectoryEntry;

export type LeafDirectoryEntry =
  | ApplicationDirectoryEntry
  | FileDirectoryEntry
  | Record<string, never>;

export type Directory = {
  [key: string]: LeafDirectoryEntry | Directory | undefined;
};

export type DirectoryEntry = Directory | LeafDirectoryEntry;

export const INITIAL_FILE_SYSTEM_DIRECTORY = {
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
      'helloworld.js': {
        name: 'helloworld',
        icon: textIconImg,
        type: 'file',
        fileExtension: 'js',
        content: 'console.log(hello world!);',
      },
    },
  },
} as const satisfies Directory;
