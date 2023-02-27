import React from 'react';
import styled, { css } from 'styled-components';

import { BsFillCircleFill } from 'react-icons/bs';
import Button from './Button';
import { ActorRefFrom } from 'xstate';
import { DesktopWindowMachine } from '../machines/desktopWindow.machine';
import { useActor } from '@xstate/react';
import { Show } from './Show';

type AppWindowProps = {
  zIndex: number;
  windowMachine: ActorRefFrom<DesktopWindowMachine>;
};

function AppWindow(props: AppWindowProps & React.PropsWithChildren) {
  const [state] = useActor(props.windowMachine);

  return (
    <Show when={!state.matches('minimized')}>
      <Wrapper zIndex={props.zIndex}>
        <AppWindowIcons />
      </Wrapper>
    </Show>
  );
}

export default AppWindow;

const Wrapper = styled.div<{
  zIndex: number;
}>`
  ${(props) =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
    `};

  position: absolute;
  border-radius: 10px;

  /* box-shadow should be displayed only if the window is focused */
  box-shadow: 2px 6px 18px rgba(0, 0, 0, 0.18);

  /* temp styles */
  left: 200px;
  top: 200px;

  /* fit-content -- we will render the app's content as children of this component and that shall determine size*/
  width: 250px;
  height: 500px;

  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  backdrop-filter: blur(65px);
`;

function AppWindowIcons() {
  function handleAppCloseClick() {}

  function handleAppMinimizeClick() {}

  return (
    <AppWindowIconsContainer>
      <Button onClick={handleAppCloseClick}>
        <AppCloseIcon />
      </Button>
      <Button>
        <AppMinimizeIcon onClick={handleAppMinimizeClick} />
      </Button>

      <AppWindowActionIcon disabled />
    </AppWindowIconsContainer>
  );
}

const AppWindowIconsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  width: fit-content;
  position: absolute;
`;

const AppWindowActionIcon = styled(BsFillCircleFill)<{ disabled?: boolean }>`
  font-size: 1.2rem;
  border-radius: 50%;
  filter: drop-shadow(0px 0px 0.2px #3e3b3bde);

  ${({ disabled }) =>
    disabled &&
    css`
      && {
        color: rgb(220, 217, 216);
      }
    `}
`;

const AppCloseIcon = styled(AppWindowActionIcon)`
  color: rgb(255, 95, 87);
`;

const AppMinimizeIcon = styled(AppWindowActionIcon)`
  color: rgb(254, 188, 47);
`;
