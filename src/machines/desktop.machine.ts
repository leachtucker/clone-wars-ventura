import { ActorRefFrom, StateFrom, assign, createMachine, spawn } from 'xstate';

import { loginMachine } from './login.machine';
import { ThemeName } from '../shared/config/themes';
import {
  DesktopWindowMachine,
  desktopWindowMachine,
} from './desktopWindow.machine';
import { ApplicationName } from '../components/apps';

type Window = { machine: ActorRefFrom<DesktopWindowMachine>; zIndex: number };

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

type FocusWindow = { type: 'WINDOW.FOCUS'; name: ApplicationName };
type CloseWindow = { type: 'WINDOW.CLOSE'; name: ApplicationName };

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
          actions: 'closeWindow',
        },
      },
    },
    {
      actions: {
        toggleTheme: assign((context) => ({
          theme: getNextTheme(context.theme),
        })),

        openWindow: assign((context, event) => {
          const newDesktopWindowMachine = spawn(
            desktopWindowMachine,
            event.name
          );

          newDesktopWindowMachine.send({
            type: 'init',
            name: event.name,
          });

          return {
            windows: [
              ...context.windows,
              {
                machine: newDesktopWindowMachine,
                zIndex: context.currentZIndexMaximum + 1,
              },
            ],
          };
        }),

        closeWindow: assign((context, event) => {
          const window = context.windows.find(
            (win) => win.machine.id === event.name
          );

          if (window?.machine?.stop) {
            window.machine.stop();
          }

          console.log('hit!');

          return {
            windows: context.windows.filter(
              (win) => win.machine.id != event.name
            ),
          };
        }),

        setWindowZIndexToTop: assign((context, event) => {
          const newWindows = context.windows.map((window) => {
            if (window.machine.id == event.name) {
              return { ...window, zIndex: context.currentZIndexMaximum + 1 };
            }

            return window;
          });

          console.log('working');

          return {
            windows: newWindows,
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
