import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from '@xstate/react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';

import * as Ramda from 'ramda';
import Color from 'color';

import ContextMenu from '../components/ContextMenu';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock, { DockIconButton } from '../components/Dock';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import {
  windowsSelector,
  minimizedWindowsSelector,
} from '../machines/desktop.machine';
import AppWindow from '../components/AppWindow';
import { ApplicationName, desktopIconsMaps } from '../components/apps';
import DesktopIcon from '../components/DesktopIcon';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, windowsSelector);
  const minimizedWindows = useSelector(
    desktopService,
    minimizedWindowsSelector
  );

  const [resetPositions, setResetPositions] = React.useState(0);
  const [selectedIcon, setSelectedIcon] =
    React.useState<ApplicationName | null>(null);

  const windowContainerRef = React.useRef<HTMLDivElement>(null);

  const pushWindowToTop = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.FOCUS', id: windowId });
  };

  const reopenWindow = (windowId: string) => {
    desktopService.send({ type: 'WINDOW.REOPEN', id: windowId });
  };

  function createIconClickHandler(appName: ApplicationName) {
    return function handleIconClick(e: React.MouseEvent) {
      e.stopPropagation();
      if (selectedIcon == appName) {
        desktopService.send({ type: 'WINDOW.OPEN', name: appName });
        setSelectedIcon(null);
      } else {
        setSelectedIcon(appName);
      }
    };
  }

  const handleCleanUp = () => {
    setResetPositions(Ramda.inc);
  };

  console.count('rerender');
  return (
    <>
      <TopBar />
      <RadixContextMenu.Root>
        <RadixContextMenu.Trigger>
          <WindowsContainer
            ref={windowContainerRef}
            onClick={() => setSelectedIcon(null)}
          >
            {windows.map((window) => (
              <AppWindow
                key={window.id}
                {...window}
                pushWindowToTop={() => pushWindowToTop(window.id)}
              />
            ))}

            {Object.entries(desktopIconsMaps).map(([appName, iconConfig]) => (
              <DesktopIcon
                icon={iconConfig}
                appName={appName as ApplicationName}
                isSelected={appName == selectedIcon}
                onClick={createIconClickHandler(appName as ApplicationName)}
                parent={windowContainerRef.current as HTMLDivElement}
                resetPositions={resetPositions}
              />
            ))}
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

export const IconButton = styled(DockIconButton)<{ isSelected: boolean }>`
  -webkit-user-drag: none;

  height: 6rem;
  padding: 4px;
  border-radius: 5px;

  ${(props) =>
    props.isSelected &&
    css`
      border: 1px solid gray;
      background-color: ${Color(props.theme.colors.almostBlack)
        .alpha(0.3)
        .toString()};
      backdrop-filter: blur(50px);
    `}
`;
