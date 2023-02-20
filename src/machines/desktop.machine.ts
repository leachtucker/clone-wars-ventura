import { assign, createMachine } from 'xstate';
import { loginMachine } from './login.machine';

type DisplayMode = 'dark' | 'light';

type MachineContext = {
  theme: DisplayMode;
};

const initialContext: MachineContext = {
  theme: 'light',
};

type LogoutEvent = { type: 'logout' };
type ToggleThemeEvent = { type: 'THEME.TOGGLE' };

type MachineEvent = LogoutEvent | ToggleThemeEvent;

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
        },

        authenticated: {
          on: {
            logout: {
              target: 'unauthenticated',
            },
          },
        },
      },
      on: {
        'THEME.TOGGLE': {
          actions: 'toggleTheme',
        },
      },
    },
    {
      actions: {
        toggleTheme: assign({
          theme: (context) => getNextTheme(context.theme),
        }),
      },
      services: {
        loginService: loginMachine,
      },
    }
  );

function getNextTheme(theme: DisplayMode): DisplayMode {
  const nextTheme = theme == 'light' ? 'dark' : 'light';
  return nextTheme;
}
