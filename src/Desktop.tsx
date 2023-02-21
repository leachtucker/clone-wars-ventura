import styled from 'styled-components';
import { useSelector } from '@xstate/react';

import { Show } from './components/Show';

import wallpaper from './assets/wallpaper.jpg';
import LockedView from './views/LockedView';
import UnlockedView from './views/UnlockedView';

import { useGlobalServices } from './shared/providers/GlobalServicesProvider';
import { isAuthenticatedSelector } from './machines/desktop.machine';

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

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-image: url(${wallpaper});
  background-size: cover;
  background-position: center;
`;
