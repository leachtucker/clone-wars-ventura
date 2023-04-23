import { StateFrom, assign, createMachine } from 'xstate';
import * as Ramda from 'ramda';

import { loginMachine } from './login.machine';
import { ThemeName } from '../shared/config/themes';
import { ApplicationName } from '../components/apps';

export type Window = {
  zIndex: number;
  id: string;
  name: ApplicationName;
  isFocused: boolean;
  isMinimized: boolean;
};

type MachineContext = {
  theme: ThemeName;
  windows: Window[];
  currentZIndexMaximum: number;
};

const initialContext: MachineContext = {
  theme: 'light',
  windows: [],
  currentZIndexMaximum: 0,
};

type LogoutEvent = { type: 'logout' };
type ToggleThemeEvent = { type: 'THEME.TOGGLE' };
// * for debugging
type AuthenticationToggleEvent = { type: 'AUTHENTICATION.TOGGLE' };

type OpenWindow = { type: 'WINDOW.OPEN'; name: ApplicationName };
type FocusWindow = { type: 'WINDOW.FOCUS'; id: string };
type CloseWindow = { type: 'WINDOW.CLOSE'; id: string };
type MinimizeWindow = { type: 'WINDOW.MINIMIZE'; id: string };
type ReopenWindow = { type: 'WINDOW.REOPEN'; id: string };

type WindowEvent =
  | OpenWindow
  | FocusWindow
  | CloseWindow
  | MinimizeWindow
  | ReopenWindow;

type MachineEvent =
  | LogoutEvent
  | ToggleThemeEvent
  | AuthenticationToggleEvent
  | WindowEvent;

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
        },

        authenticated: {
          on: {
            logout: {
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

          const newWindow: Window = {
            id: uid,
            name: event.name,
            zIndex: nextZIndex,
            isFocused: true,
            isMinimized: false,
          };

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
