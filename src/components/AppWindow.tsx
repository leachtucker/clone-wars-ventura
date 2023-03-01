import React from 'react';
import styled, { css } from 'styled-components';

import { ActorRefFrom } from 'xstate';
import { DesktopWindowMachine } from '../machines/desktopWindow.machine';
import { useActor } from '@xstate/react';
import { Show } from './Show';
import { Rnd } from 'react-rnd';
import AboutThisMac, { AboutThisMac_RND_CONFIG } from './apps/AboutThisMac';
import AppWindowMenu from './AppWindowMenu';

type AppWindowProps = {
  zIndex: number;
  windowMachine: ActorRefFrom<DesktopWindowMachine>;
};

function AppWindow(props: AppWindowProps & React.PropsWithChildren) {
  const [state] = useActor(props.windowMachine);
  const isWindowFocused = state.matches('focused');
  console.log({ state });

  // @ts-expect-error test
  const ApplicationComponent = applicationComponentMap[state.context.name];
  // @ts-expect-error test
  const applicationRndConfig = applicationRndMap[state.context.name];

  return (
    <Show when={!state.matches('minimized')}>
      <Rnd
        enableUserSelectHack
        enableResizing
        bounds="parent"
        dragHandleClassName="dragHandle"
        cancel=".interactable"
        {...applicationRndConfig}
        default={{
          x: 250,
          y: 200,
          ...applicationRndConfig.default,
        }}
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

const applicationComponentMap = {
  aboutThisMac: AboutThisMac,
} as const;

const applicationRndMap = {
  aboutThisMac: AboutThisMac_RND_CONFIG,
} as const;
