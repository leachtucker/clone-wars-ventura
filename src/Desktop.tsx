import styled from 'styled-components';

import { useMachine } from '@xstate/react';

import { desktopMachine } from './machines/desktop.machine';

import { Show } from './components/Show';

import wallpaper from './assets/wallpaper.jpg';
import LockedView from './views/LockedView';

function Desktop() {
  const [state, send] = useMachine(desktopMachine);

  console.log({
    desktopState: state,
    loginService: state.children.loginService,
  });

  return (
    <ViewContainer>
      <Show when={state.matches('unauthenticated')}>
        <LockedView service={state.children.loginService} />
      </Show>

      <Show when={state.matches('authenticated')}>
        <h1>Authenticated!</h1>
      </Show>
    </ViewContainer>
  );
}

export default Desktop;

const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${wallpaper});
  background-size: cover;
`;
