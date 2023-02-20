import { InterpreterFrom } from 'xstate';
import { DesktopMachine } from '../../machines/desktop.machine';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    desktopService: InterpreterFrom<DesktopMachine>;
  }
}
