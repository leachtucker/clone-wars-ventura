import { ActorRefFrom } from 'xstate';
import { DesktopMachine } from '../../../machines/desktop.machine';
import { ApplicationName } from '..';

export function handleOpenCommand(
  service: ActorRefFrom<DesktopMachine>,
  appName: string
) {
  const validAppNames = ['chrome'];
  if (validAppNames.includes(appName)) {
    service.send({ type: 'WINDOW.OPEN', name: appName as ApplicationName });
  }

  throw Error('App not found');
}
