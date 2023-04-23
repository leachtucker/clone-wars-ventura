import React from 'react';
import styled from 'styled-components';
import { useActor, useSelector } from '@xstate/react';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import {
  windowsSelector,
  minimizedWindowsSelector,
} from '../machines/desktop.machine';
import AppWindow from '../components/AppWindow';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, windowsSelector);
  const minimizedWindows = useSelector(
    desktopService,
    minimizedWindowsSelector
  );

  const [state, send] = useActor(desktopService);
  console.log({ state });

  const pushWindowToTop = (windowId: string) => {
    send({ type: 'WINDOW.FOCUS', id: windowId });
  };

  const reopenWindow = (windowId: string) => {
    send({ type: 'WINDOW.REOPEN', id: windowId });
  };

  return (
    <>
      <TopBar />
      <WindowsContainer>
        {windows.map((window) => (
          <AppWindow
            key={window.id}
            {...window}
            pushWindowToTop={() => pushWindowToTop(window.id)}
          />
        ))}
      </WindowsContainer>
      <Dock
        minimizedWindows={minimizedWindows}
        onMinimizedWindowClick={reopenWindow}
      />
    </>
  );
}

export default UnlockedView;

const WindowsContainer = styled.div`
  position: relative;

  height: calc(100vh - ${TOPBAR_HEIGHT_PX}px - 1rem);
  /* Necessary for not allowing windows to be dragged out of the viewport */
  margin: 0 1rem;
`;
