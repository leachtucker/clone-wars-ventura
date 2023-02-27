import React from 'react';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import styled from 'styled-components';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useActor, useSelector } from '@xstate/react';
import { windowsSelector } from '../machines/desktop.machine';
import AppWindow from '../components/AppWindow';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, windowsSelector);

  const [state] = useActor(desktopService);
  console.log({ state });

  return (
    <>
      <TopBar />
      <WindowsContainer>
        {windows.map((window, idx) => (
          <AppWindow
            key={idx}
            zIndex={window.zIndex}
            windowMachine={window.machine}
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
