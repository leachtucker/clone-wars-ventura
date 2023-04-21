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
  pushWindowToTop: () => void;
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
        style={{ zIndex: props.zIndex }}
        onDragStart={props.pushWindowToTop}
      >
        <Wrapper
          className="dragHandle"
          isFocused={props.isFocused}
          onClick={props.pushWindowToTop}
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
  isFocused: boolean;
}>`
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
