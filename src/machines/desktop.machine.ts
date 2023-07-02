import { StateFrom, assign, createMachine } from 'xstate';
import * as Ramda from 'ramda';

import { loginMachine } from './login.machine';
import { ThemeName } from '../shared/config/themes';
import type { ApplicationName } from '../components/apps/app-config-mappings';

import type {
  Directory,
  DirectoryEntry,
  LeafDirectoryEntry,
} from '../shared/file-system';
import {
  INITIAL_FILE_SYSTEM_DIRECTORY,
  FileDirectoryEntry,
} from '../shared/file-system';

export type WindowAppData = any;

export type Window = {
  zIndex: number;
  id: string;
  name: ApplicationName;
  isFocused: boolean;
  isMinimized: boolean;
  appData?: WindowAppData;
};

type MachineContext = {
  theme: ThemeName;
  windows: Window[];
  currentZIndexMaximum: number;
  fileSystem: Directory;
};

const initialContext: MachineContext = {
  theme: 'light',
  windows: [],
  currentZIndexMaximum: 0,
  fileSystem: Ramda.clone(INITIAL_FILE_SYSTEM_DIRECTORY),
};

type LogoutEvent = { type: 'AUTHENTICATION.LOGOUT' };
type ToggleThemeEvent = { type: 'THEME.TOGGLE' };

// * for debugging
type AuthenticationToggleEvent = { type: 'AUTHENTICATION.TOGGLE' };

type OpenWindow = { type: 'WINDOW.OPEN'; name: ApplicationName };
type OpenWindowWithData = {
  type: 'WINDOW.OPEN_WITH_DATA';
  name: ApplicationName;
  data: WindowAppData;
};
type FocusWindow = { type: 'WINDOW.FOCUS'; id: string };
type CloseWindow = { type: 'WINDOW.CLOSE'; id: string };
type MinimizeWindow = { type: 'WINDOW.MINIMIZE'; id: string };
type ReopenWindow = { type: 'WINDOW.REOPEN'; id: string };

type WindowEvent =
  | OpenWindow
  | OpenWindowWithData
  | FocusWindow
  | CloseWindow
  | MinimizeWindow
  | ReopenWindow;

type CreateDirectoryEntryEvent = {
  type: 'FILE_SYSTEM.DIRECTORY_ENTRY.CREATE';
  entry: DirectoryEntry;
  path: string[];
};

type RemoveDirectoryEntryEvent = {
  type: 'FILE_SYSTEM.DIRECTORY_ENTRY.REMOVE';
  path: string[];
};

type ModifyDirectoryEntryFileContent = {
  type: 'FILE_SYSTEM.DIRECTORY_ENTRY.MODIFY_CONTENT';
  path: string[];
  content: string;
};

type FileSystemEvent =
  | CreateDirectoryEntryEvent
  | RemoveDirectoryEntryEvent
  | ModifyDirectoryEntryFileContent;

type MachineEvent =
  | LogoutEvent
  | ToggleThemeEvent
  | AuthenticationToggleEvent
  | WindowEvent
  | FileSystemEvent;

export type DesktopMachine = typeof desktopMachine;
export const desktopMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QTgawC4HsAOA6ArgHYCG+6AFmIegJYDGx6kAxBJoWLjYQG6aqcANpijcAymABOPemADaABgC6iUNkywatdqpAAPRAGYALACZcAdgCcANgAcVgIwBWO46vGLhgDQgAnoiOhuYKoQqmVuFOzgo2AL5xviiwGDi4pBRUtAxMEMwAggCqACoAEgCiAHLFAJIAwvm1APKVuMVNAOIdADLliipIIOqa2oS6Bggm5tb20W4eXr4BCG64MaGOjg6OpnY2NlYJiSCEmMm6yanYusNaNDqDEwC0NkuILwlJaFh4RBmU1HojEgNw0dweoAmZjeCE2xlwhgUVmirgUhlmzk+IEuP3SZAB2WBEFBI3uY0eiBsCmcuDM7gUxj2FgsdmcjhhjkZuE5wUcXlMFn2dkFRziQA */
  createMachine(
    {
      id: 'desktop',
      tsTypes: {} as import('./desktop.machine.typegen').Typegen0,
      predictableActionArguments: true,
      preserveActionOrder: true,
      schema: {
        context: {} as MachineContext,
        events: {} as MachineEvent,
      },
      context: initialContext,
      initial: 'unauthenticated',
      states: {
        unauthenticated: {
          invoke: {
            id: 'loginService',
            src: 'loginService',
            onDone: {
              target: 'authenticated',
            },
          },
          on: {
            'AUTHENTICATION.TOGGLE': {
              target: 'unauthenticated',
            },
          },
          entry: ['resetContext'],
        },

        authenticated: {
          on: {
            'AUTHENTICATION.LOGOUT': {
              target: 'unauthenticated',
            },

            // * for debugging
            'AUTHENTICATION.TOGGLE': {
              target: 'unauthenticated',
            },
          },
        },
      },

      on: {
        'THEME.TOGGLE': {
          actions: 'toggleTheme',
        },

        'WINDOW.OPEN': {
          actions: 'openWindow',
        },

        'WINDOW.OPEN_WITH_DATA': {
          actions: 'openWindowWithData',
        },

        'WINDOW.FOCUS': {
          actions: ['setWindowZIndexToTop'],
        },

        'WINDOW.CLOSE': {
          actions: ['closeWindow'],
        },

        'WINDOW.MINIMIZE': {
          actions: ['minimizeWindow'],
        },

        'WINDOW.REOPEN': {
          actions: ['reopenWindow', 'setWindowZIndexToTop'],
        },

        'FILE_SYSTEM.DIRECTORY_ENTRY.CREATE': {
          cond: (context, event) => {
            const entryExists =
              Ramda.path(event.path, context.fileSystem) != undefined;

            return !entryExists;
          },
          actions: ['createDirectoryEntry'],
        },

        'FILE_SYSTEM.DIRECTORY_ENTRY.REMOVE': {
          actions: ['removeDirectoryEntry'],
        },

        'FILE_SYSTEM.DIRECTORY_ENTRY.MODIFY_CONTENT': {
          cond: (context, event) => {
            const entry = Ramda.path<Directory | LeafDirectoryEntry>(
              event.path,
              context.fileSystem
            );

            const isFileDirectoryEntry = entry?.type == 'file';
            return isFileDirectoryEntry;
          },
          actions: ['modifyFileContent'],
        },
      },
    },
    {
      actions: {
        toggleTheme: assign((context) => ({
          theme: getNextTheme(context.theme),
        })),

        openWindow: assign((context, event) => {
          const uid = self.crypto.randomUUID();
          const nextZIndex = context.currentZIndexMaximum + 1;

          const newWindow = {
            id: uid,
            name: event.name,
            zIndex: nextZIndex,
            isFocused: true,
            isMinimized: false,
            appData: {},
          } satisfies Window;

          return {
            windows: [...context.windows, newWindow],
            currentZIndexMaximum: nextZIndex,
          };
        }),

        openWindowWithData: assign((context, event) => {
          const uid = self.crypto.randomUUID();
          const nextZIndex = context.currentZIndexMaximum + 1;

          const newWindow = {
            id: uid,
            name: event.name,
            zIndex: nextZIndex,
            isFocused: true,
            isMinimized: false,
            appData: event.data,
          } satisfies Window;

          return {
            windows: [...context.windows, newWindow],
            currentZIndexMaximum: nextZIndex,
          };
        }),

        closeWindow: assign((context, event) => ({
          windows: context.windows.filter((win) => win.id != event.id),
        })),

        minimizeWindow: assign((context, event) => ({
          windows: context.windows.map((win) => {
            if (win.id == event.id) {
              return { ...win, isFocused: false, isMinimized: true };
            }

            return win;
          }),
        })),

        reopenWindow: assign((context, event) => ({
          windows: context.windows.map((win) => {
            if (win.id == event.id) {
              return { ...win, isFocused: true, isMinimized: false };
            }

            return win;
          }),
        })),

        setWindowZIndexToTop: assign((context, event) => {
          const nextZIndex = context.currentZIndexMaximum + 1;

          const updatedWindows = context.windows.map((win) => {
            if (win.id == event.id) {
              return { ...win, zIndex: nextZIndex };
            }

            return win;
          });

          return {
            windows: updatedWindows,
            currentZIndexMaximum: nextZIndex,
          };
        }),

        createDirectoryEntry: assign((context, event) => {
          const newFileSystem = Ramda.assocPath(
            event.path,
            event.entry,
            context.fileSystem
          );

          return {
            fileSystem: newFileSystem,
          };
        }),

        removeDirectoryEntry: assign((context, event) => {
          const newFileSystem = Ramda.dissocPath<Directory>(
            event.path,
            context.fileSystem
          );

          return {
            fileSystem: newFileSystem,
          };
        }),

        modifyFileContent: assign((context, event) => {
          const existingEntry = Ramda.path(event.path)(
            context.fileSystem
          ) as FileDirectoryEntry;

          const newDirEntry = {
            ...existingEntry,
            content: event.content,
          } satisfies FileDirectoryEntry;

          const newFileSystem = Ramda.assocPath(
            event.path,
            newDirEntry,
            context.fileSystem
          );

          return {
            fileSystem: newFileSystem,
          };
        }),

        resetContext: assign(() => initialContext),
      },

      services: {
        loginService: loginMachine,
      },
    }
  );

function getNextTheme(theme: ThemeName): ThemeName {
  const nextTheme = theme == 'light' ? 'dark' : 'light';
  return nextTheme;
}

/* Selectors */
export const isAuthenticatedSelector = (state: StateFrom<DesktopMachine>) =>
  state.matches('authenticated');

export const loginServiceSelector = (state: StateFrom<DesktopMachine>) =>
  state.children.loginService;

export const windowsSelector = (state: StateFrom<DesktopMachine>) =>
  state.context.windows;

export const visibleWindowsSelector = (state: StateFrom<DesktopMachine>) =>
  state.context.windows.filter(Ramda.compose(Ramda.not, isMinimized));

export const minimizedWindowsSelector = (state: StateFrom<DesktopMachine>) =>
  state.context.windows.filter(isMinimized);

const isMinimized = Ramda.propEq('isMinimized', true);

export const isThemeDarkSelector = (state: StateFrom<DesktopMachine>) =>
  state.context.theme === 'dark';

export const fileSystemSelector = (state: StateFrom<DesktopMachine>) =>
  state.context.fileSystem;
