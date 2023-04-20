import { createMachine, assign } from 'xstate';
import { sendParent } from 'xstate/lib/actions';

import { ApplicationName } from '../components/apps';

type MachineContext = {
  name: ApplicationName | null;
};

const initialContext = {
  name: null,
} satisfies MachineContext;

type InitEvent = { type: 'init'; name: ApplicationName };
type MinimizeEvent = { type: 'minimize' };
type CloseEvent = { type: 'close' };

type MachineEvent = InitEvent | MinimizeEvent | CloseEvent;

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
        entry: ['focusApp'],
      },

      unfocused: {},

      minimized: {},
    },

    on: {
      close: {
        actions: ['closeApp'],
      },
    },
  },
  {
    actions: {
      assignName: assign((context, event) => ({
        name: event.name,
      })),

      focusApp: sendParent((context) => ({
        type: 'WINDOW.FOCUS',
        name: context.name,
      })),

      closeApp: sendParent((context) => ({
        type: 'WINDOW.CLOSE',
        name: context.name,
      })),
    },
  }
);
