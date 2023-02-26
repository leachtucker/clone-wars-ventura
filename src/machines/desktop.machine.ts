import { StateFrom, assign, createMachine } from 'xstate';
import * as Ramda from 'ramda';

import { loginMachine } from './login.machine';
import { ThemeName } from '../shared/config/themes';

type DesktopWindow = {
  name: string;
  hasFocus: boolean;
  isMinimized: boolean;
  zIndex: number;
  xPos: number;
  yPos: number;
};

const initialDesktopWindowState: Omit<DesktopWindow, 'name'> = {
  hasFocus: true,
  isMinimized: false,
  zIndex: 1,
  xPos: 100,
  yPos: 100,
};

type MachineContext = {
  theme: ThemeName;
  windows: DesktopWindow[];
};

const initialContext: MachineContext = {
  theme: 'light',
  windows: [],
};

type LogoutEvent = { type: 'logout' };
type ToggleThemeEvent = { type: 'THEME.TOGGLE' };
// * for debugging
type AuthenticationToggleEvent = { type: 'AUTHENTICATION.TOGGLE' };
type OpenWindow = { type: 'WINDOW.OPEN'; appName: string };

type MachineEvent =
  | LogoutEvent
  | ToggleThemeEvent
  | AuthenticationToggleEvent
  | OpenWindow;

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
            // * for debugging
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
      },
    },
    {
      actions: {
        toggleTheme: assign((context) => ({
          theme: getNextTheme(context.theme),
        })),

        openWindow: assign((context, event) => {
          const newWindow = {
            ...initialDesktopWindowState,
            name: event.appName,
          };

          return {
            windows: [...context.windows, newWindow],
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

const isActiveWindow = Ramda.propEq('isMinimized', false);
export const activeWindowsSelector = (state: StateFrom<DesktopMachine>) => {
  return state.context.windows.filter(isActiveWindow);
};
