import styled from 'styled-components';
import { useSelector } from '@xstate/react';

import { Show } from './components/Show';

import wallpaper from './assets/wallpaper.jpg';
import LockedView from './views/LockedView';
import { useGlobalServices } from './shared/providers/GlobalServicesProvider';
import { StateFrom } from 'xstate';
import { DesktopMachine } from './machines/desktop.machine';
import UnlockedView from './views/UnlockedView';

function Desktop() {
  const { desktopService } = useGlobalServices();
  const isAuthenticated = useSelector(desktopService, isAuthenticatedSelector);

  return (
    <Container>
      <Show when={!isAuthenticated}>
        <LockedView />
      </Show>

      <Show when={isAuthenticated}>
        <UnlockedView />
      </Show>
    </Container>
  );
}

export default Desktop;

const isAuthenticatedSelector = (state: StateFrom<DesktopMachine>) =>
  state.matches('authenticated');

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-image: url(${wallpaper});
  background-size: cover;
  background-position: center;
`;
