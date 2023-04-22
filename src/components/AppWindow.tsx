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
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useActor } from '@xstate/react';

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
  const { desktopService } = useGlobalServices();
  const [, send] = useActor(desktopService);

  const handleAppCloseClick = (windowId: string) => {
    send({ type: 'WINDOW.CLOSE', id: windowId });
  };

  const handleAppMinimizeClick = (windowId: string) => {
    send({ type: 'WINDOW.MINIMIZE', id: windowId });
  };

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
          <AppWindowMenu
            onCloseClick={() => handleAppCloseClick(props.id)}
            onMinimizeClick={() => handleAppMinimizeClick(props.id)}
          />
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
