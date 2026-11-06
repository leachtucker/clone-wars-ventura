import React from 'react';
import styled, { css } from 'styled-components';
import { Rnd } from 'react-rnd';

import AppWindowMenu from './AppWindowMenu';
import {
  ApplicationName,
  applicationComponentMap,
  applicationRndMap,
} from './apps/app-config-mappings';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useIsMobile } from '../hooks/useIsMobile';
import { WindowAppData } from '../machines/desktop.machine';

export type ApplicationComponentProps = {
  isFocused: boolean;
  id: string;
  appData: WindowAppData;
};

type AppWindowProps = {
  name: ApplicationName;
  isMinimized: boolean;
  isFocused: boolean;
  zIndex: number;
  id: string;
  appData?: WindowAppData;
  pushWindowToTop: () => void;
};

function AppWindow(props: React.PropsWithChildren<AppWindowProps>) {
  const { desktopService } = useGlobalServices();
  const isMobile = useIsMobile();

  const handleAppCloseClick = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.CLOSE', id: windowId });
  };

  const handleAppMinimizeClick = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.MINIMIZE', id: windowId });
  };

  const ApplicationComponent = applicationComponentMap[props.name];
  const applicationRndConfig = applicationRndMap[props.name];

  const windowContent = (
    <Wrapper
      className="dragHandle"
      isFocused={props.isFocused}
      isMobile={isMobile}
      onClick={props.pushWindowToTop}
    >
      <ApplicationComponent
        isFocused={props.isFocused}
        id={props.id}
        appData={props.appData}
      />
      <AppWindowMenu
        onCloseClick={() => handleAppCloseClick(props.id)}
        onMinimizeClick={() => handleAppMinimizeClick(props.id)}
      />
    </Wrapper>
  );

  // On phones there is no room for floating windows: desktop-sized windows
  // (700px wide, some with 400-500px minimums) overflow a ~390px screen and
  // start partially off-screen. Apps instead take the full screen, like
  // iOS apps, with no dragging or resizing.
  if (isMobile) {
    return (
      <MobileWindowContainer
        style={{
          zIndex: props.zIndex,
          visibility: props.isMinimized ? 'hidden' : 'visible',
        }}
        onClick={props.pushWindowToTop}
      >
        {windowContent}
      </MobileWindowContainer>
    );
  }

  return (
    <Rnd
      enableUserSelectHack
      bounds="parent"
      dragHandleClassName="dragHandle"
      cancel=".interactable"
      {...applicationRndConfig}
      style={{
        zIndex: props.zIndex,
        visibility: props.isMinimized ? 'hidden' : 'visible',
      }}
      onDragStart={props.pushWindowToTop}
    >
      {windowContent}
    </Rnd>
  );
}

export default AppWindow;

const MobileWindowContainer = styled.div`
  position: absolute;
  /* Stop above the dock (75px tall + its bottom offset + the iPhone
     home-indicator safe area) so app content is never hidden behind it. */
  inset: 0 0 calc(84px + env(safe-area-inset-bottom, 0px)) 0;
`;

const Wrapper = styled.div<{
  isFocused: boolean;
  isMobile?: boolean;
}>`
  position: absolute;
  border-radius: ${(props) => (props.isMobile ? '0' : '10px')};
  width: 100%;
  height: 100%;

  ${(props) =>
    props.isFocused &&
    css`
      box-shadow: 2px 6px 18px rgba(0, 0, 0, 0.18);
    `}
`;
