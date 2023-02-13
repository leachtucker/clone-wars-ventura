import { createMachine } from 'xstate';

type DisplayMode = 'dark' | 'light';

type MachineContext = {
  theme: DisplayMode;
};

type Event = { type: 'login' } | { type: 'logout' };

const initialContext: MachineContext = {
  theme: 'light',
};

export const desktopMachine = createMachine({
  id: 'desktop',
  tsTypes: {} as import('./desktop.machine.typegen').Typegen0,
  schema: {
    context: {} as MachineContext,
    events: {} as Event,
  },
  context: initialContext,
  initial: 'idle',
  states: {
    idle: {
      on: {
        login: {
          target: 'loggedIn',
        },
        logout: {
          target: 'loggedOut',
        },
      },
    },

    loggedIn: {},

    loggedOut: {},
  },
});
