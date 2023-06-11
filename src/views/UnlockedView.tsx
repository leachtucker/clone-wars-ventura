import React from 'react';
import styled from 'styled-components';
import { useSelector } from '@xstate/react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';

import * as Ramda from 'ramda';

import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import {
  windowsSelector,
  minimizedWindowsSelector,
} from '../machines/desktop.machine';

import ContextMenu from '../components/ContextMenu';
import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import AppWindow from '../components/AppWindow';
import DesktopIconList from '../components/DesktopIconList';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, windowsSelector);
  const minimizedWindows = useSelector(
    desktopService,
    minimizedWindowsSelector
  );

  const pushWindowToTop = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.FOCUS', id: windowId });
  };

  const reopenWindow = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.REOPEN', id: windowId });
  };

  const windowContainerRef = React.useRef<HTMLDivElement>(null);
  const [resetIconPositions, setResetIconPositions] = React.useState(false);

  const handleCleanUp = () => {
    setResetIconPositions(Ramda.not);
  };

  console.count('rerender');
  return (
    <>
      <TopBar />
      <RadixContextMenu.Root>
        <RadixContextMenu.Trigger>
          <WindowsContainer ref={windowContainerRef}>
            {windows.map((window) => (
              <AppWindow
                key={window.id}
                {...window}
                pushWindowToTop={() => pushWindowToTop(window.id)}
              />
            ))}

            <DesktopIconList resetIconPositions={resetIconPositions} />
          </WindowsContainer>
          <Dock
            minimizedWindows={minimizedWindows}
            onMinimizedWindowClick={reopenWindow}
          />
        </RadixContextMenu.Trigger>

        <RadixContextMenu.Portal>
          <ContextMenu onCleanUp={handleCleanUp} />
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
