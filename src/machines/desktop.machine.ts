import { StateFrom, assign, createMachine } from 'xstate';
import * as Ramda from 'ramda';

import { loginMachine } from './login.machine';
import { ThemeName } from '../shared/config/themes';
import { ApplicationName } from '../components/apps';

type Window = {
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

type MachineEvent =
  | LogoutEvent
  | ToggleThemeEvent
  | AuthenticationToggleEvent
  | OpenWindow
  | FocusWindow
  | CloseWindow;

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

        setWindowZIndexToTop: assign((context, event) => {
          const nextZIndex = context.currentZIndexMaximum + 1;

          const updatedWindows = context.windows.map((window) => {
            if (window.id == event.id) {
              return { ...window, zIndex: nextZIndex };
            }

            return window;
          });

          return {
            windows: updatedWindows,
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
  state.context.windows.filter(isMinimized);

const isMinimized = Ramda.propEq('isMinimized', false);
