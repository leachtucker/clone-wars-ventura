import React from 'react';
import styled from 'styled-components';
import { useSelector } from '@xstate/react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import ContextMenu from '../components/ContextMenu';

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

  console.count('rerender');

  const pushWindowToTop = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.FOCUS', id: windowId });
  };

  const reopenWindow = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.REOPEN', id: windowId });
  };

  return (
    <>
      <TopBar />
      <RadixContextMenu.Root>
        <RadixContextMenu.Trigger>
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
        </RadixContextMenu.Trigger>

        <RadixContextMenu.Portal>
          <ContextMenu />
        </RadixContextMenu.Portal>
      </RadixContextMenu.Root>
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
