import React from 'react';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import styled from 'styled-components';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useActor, useSelector } from '@xstate/react';
import { visibleWindowsSelector } from '../machines/desktop.machine';
import AppWindow from '../components/AppWindow';

function UnlockedView() {
  const { desktopService } = useGlobalServices();
  const windows = useSelector(desktopService, visibleWindowsSelector);

  const [state] = useActor(desktopService);
  console.log({ state });

  return (
    <>
      <TopBar />
      <WindowsContainer>
        {windows.map((window) => (
          <AppWindow key={window.id} {...window} />
        ))}
      </WindowsContainer>
      <Dock />
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
