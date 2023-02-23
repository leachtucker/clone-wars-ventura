import React from 'react';

import TopBar, { TOPBAR_HEIGHT_PX } from '../components/TopBar';
import Dock from '../components/Dock';
import styled from 'styled-components';

function UnlockedView() {
  return (
    <>
      <TopBar />
      <WindowsContainer />
      <Dock />
    </>
  );
}

export default UnlockedView;

const WindowsContainer = styled.div`
  height: calc(100vh - ${TOPBAR_HEIGHT_PX}px);
`;
