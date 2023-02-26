import React from 'react';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import styled from 'styled-components';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useSelector } from '@xstate/react';
import { activeWindowsSelector } from '../machines/desktop.machine';
import AppWindow from '../components/AppWindow';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const activeWindows = useSelector(desktopService, activeWindowsSelector);

  return (
    <>
      <TopBar />
      <WindowsContainer>
        {activeWindows.map((window) => (
          <AppWindow
            key={window.name}
            title={window.name}
            zIndex={window.zIndex}
            xPos={window.xPos}
            yPos={window.yPos}
          />
        ))}
      </WindowsContainer>
      <Dock />
    </>
  );
}

export default UnlockedView;

const WindowsContainer = styled.div`
  height: calc(100vh - ${TOPBAR_HEIGHT_PX}px);
`;
