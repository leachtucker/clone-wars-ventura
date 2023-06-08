import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector } from '@xstate/react';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import { Rnd } from 'react-rnd';
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

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, windowsSelector);
  const minimizedWindows = useSelector(
    desktopService,
    minimizedWindowsSelector
  );

  const [selectedIcon, setSelectedIcon] =
    React.useState<ApplicationName | null>(null);

  const windowContainerRef = React.useRef<HTMLDivElement>(null);
  const rndIconsRef = React.useRef<{ el: Rnd; appName: ApplicationName }[]>([]);

  console.count('rerender');

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
    console.log({ c: rndIconsRef.current });
    rndIconsRef.current.forEach((icon) =>
      icon.el.updatePosition({ x: 0, y: 20 })
    );
  };

  function pushRndRef(appName: ApplicationName) {
    return function inner(el: Rnd | null) {
      if (el) {
        rndIconsRef.current.push({
          el: el,
          appName,
        });
      }
    };
  }

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
              <Rnd
                ref={pushRndRef(appName as ApplicationName)}
                bounds={windowContainerRef.current as HTMLDivElement}
                enableResizing={false}
                enableUserSelectHack
                default={{
                  ...iconConfig.position,
                  width: 'auto',
                  height: 'auto',
                }}
                dragGrid={[20, 20]}
              >
                <IconButton
                  aria-label={appName}
                  onClick={createIconClickHandler(appName as ApplicationName)}
                  isSelected={selectedIcon == appName}
                >
                  <img
                    src={iconConfig.image}
                    style={{ height: '100%', borderRadius: '8px' }}
                    draggable={false}
                  />
                </IconButton>
              </Rnd>
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
