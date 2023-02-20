import styled from 'styled-components';
import { useSelector } from '@xstate/react';

import { Show } from './components/Show';

import wallpaper from './assets/wallpaper.jpg';
import LockedView from './views/LockedView';
import { useGlobalServices } from './shared/providers/GlobalServicesProvider';
import { StateFrom } from 'xstate';
import { DesktopMachine } from './machines/desktop.machine';

function Desktop() {
  const { desktopService } = useGlobalServices();

  const isAuthenticated = useSelector(desktopService, isAuthenticatedSelector);
  const loginService = useSelector(desktopService, loginServiceSelector);

  return (
    <ViewContainer>
      <Show when={!isAuthenticated}>
        <LockedView service={loginService} />
      </Show>

      <Show when={isAuthenticated}>
        <h1>Authenticated!</h1>
      </Show>
    </ViewContainer>
  );
}

export default Desktop;

const isAuthenticatedSelector = (state: StateFrom<DesktopMachine>) =>
  state.matches('authenticated');

const loginServiceSelector = (state: StateFrom<DesktopMachine>) =>
  state.children.loginService;

const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${wallpaper});
  background-size: cover;
`;
