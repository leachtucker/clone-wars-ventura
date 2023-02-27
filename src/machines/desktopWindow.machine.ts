import { createMachine, assign } from 'xstate';
import { sendParent } from 'xstate/lib/actions';

type MachineContext = {
  name: string;
};

const initialContext: MachineContext = {
  name: '',
};

type InitEvent = { type: 'init'; name: string };
type MinimizeEvent = { type: 'minimize' };

type MachineEvent = InitEvent | MinimizeEvent;

export type DesktopWindowMachine = typeof desktopWindowMachine;
export const desktopWindowMachine = createMachine(
  {
    id: 'desktopWindow',
    tsTypes: {} as import('./desktopWindow.machine.typegen').Typegen0,
    schema: {
      context: {} as MachineContext,
      events: {} as MachineEvent,
    },
    context: initialContext,
    initial: 'idle',
    states: {
      idle: {
        on: {
          init: {
            actions: ['assignName'],
            target: 'focused',
          },
        },
      },

      focused: {
        entry: [
          (context) => sendParent({ type: 'WINDOW.FOCUS', name: context.name }),
        ],
      },

      unfocused: {},

      minimized: {},
    },
  },
  {
    actions: {
      assignName: assign((context, event) => ({
        name: event.name,
      })),
    },
  }
);
