import React from 'react';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';

import { Show } from './Show';

import AppWindowMenu from './AppWindowMenu';
import {
  ApplicationName,
  applicationComponentMap,
  applicationRndMap,
} from './apps';

export type ApplicationComponentProps = {
  isFocused: boolean;
};

type AppWindowProps = {
  name: ApplicationName;
  isMinimized: boolean;
  isFocused: boolean;
  zIndex: number;
  id: string;
};

function AppWindow(props: React.PropsWithChildren<AppWindowProps>) {
  const ApplicationComponent = applicationComponentMap[props.name];
  const applicationRndConfig = applicationRndMap[props.name];

  return (
    <Show when={!props.isMinimized}>
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
          isFocused={props.isFocused}
        >
          <ApplicationComponent isFocused={props.isFocused} />
          <AppWindowMenu windowId={props.id} />
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
