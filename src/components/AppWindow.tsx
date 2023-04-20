import React from 'react';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';

import { ActorRefFrom } from 'xstate';
import { useActor } from '@xstate/react';

import { DesktopWindowMachine } from '../machines/desktopWindow.machine';
import { Show } from './Show';

import AppWindowMenu from './AppWindowMenu';
import { applicationComponentMap, applicationRndMap } from './apps';

export type ApplicationComponentProps = {
  isFocused: boolean;
};

type AppWindowProps = {
  zIndex: number;
  windowMachine: ActorRefFrom<DesktopWindowMachine>;
};

function AppWindow(props: AppWindowProps & React.PropsWithChildren) {
  const [state] = useActor(props.windowMachine);
  const isWindowFocused = state.matches('focused');
  console.log({ state });

  if (state.context.name) {
    const ApplicationComponent = applicationComponentMap[state.context.name];
    const applicationRndConfig = applicationRndMap[state.context.name];

    return (
      <Show when={!state.matches('minimized')}>
        <Rnd
          enableUserSelectHack
          bounds="parent"
          dragHandleClassName="dragHandle"
          cancel=".interactable"
          {...applicationRndConfig}
        >
          <Wrapper
            className="dragHandle"
            zIndex={props.zIndex}
            isFocused={isWindowFocused}
          >
            <ApplicationComponent isFocused={isWindowFocused} />
            <AppWindowMenu windowMachine={props.windowMachine} />
          </Wrapper>
        </Rnd>
      </Show>
    );
  }
}

export default AppWindow;

const Wrapper = styled.div<{
  zIndex: number;
  isFocused: boolean;
}>`
  ${(props) =>
    props.zIndex &&
    css`
      z-index: ${props.zIndex};
    `};

  position: absolute;
  border-radius: 10px;
  width: 100%;
  height: 100%;

  ${(props) =>
    props.isFocused &&
    css`
      box-shadow: 2px 6px 18px rgba(0, 0, 0, 0.18);
    `}
`;
