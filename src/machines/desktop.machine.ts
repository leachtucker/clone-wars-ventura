import { createMachine } from 'xstate';
import { loginMachine } from './login.machine';

type DisplayMode = 'dark' | 'light';

type MachineContext = {
  theme: DisplayMode;
};

type Event = { type: 'AUTHENTICATION.TOGGLE' };

const initialContext: MachineContext = {
  theme: 'light',
};

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
        events: {} as Event,
      },
      context: initialContext,
      initial: 'unauthenticated',
      states: {
        idle: {},

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
            'AUTHENTICATION.TOGGLE': {
              target: 'unauthenticated',
            },
          },
        },
      },
    },
    {
      actions: {},
      services: {
        loginService: loginMachine,
      },
    }
  );
