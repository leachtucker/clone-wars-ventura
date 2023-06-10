import React from 'react';
import styled from 'styled-components';

import AppleMenu from './AppleMenu';

import themes from '../shared/config/themes';
import ControlPanelDropdown from './ControlPanelDropdown';
import SimpleDate from './primitives/SimpleDate';
import useCurrentDate from '../hooks/useCurrentDate';
import Button from './primitives/Button';

function TopBar() {
  const date = useCurrentDate();

  return (
    <Wrapper>
      <LeftRightContainer>
        <AppleMenu />
      </LeftRightContainer>

      <LeftRightContainer>
        <ControlPanelDropdown />

        <SimpleDate date={date} />
      </LeftRightContainer>
    </Wrapper>
  );
}

export default TopBar;

export const TOPBAR_HEIGHT_PX = 25;
const Wrapper = styled.div`
  height: ${TOPBAR_HEIGHT_PX}px;
  width: 100%;

  color: ${themes.dark.colors.primary};
  background-color: ${themes.dark.colors.backgroundTransparent};
  backdrop-filter: blur(65px);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 1.5rem;
`;

const LeftRightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;

  height: 100%;
`;

export const TopBarButton = styled(Button)`
  height: 100%;
  display: flex;
  align-items: center;

  padding: 0.2rem 1rem;
  border-radius: 4px;

  &[data-state='open'] {
    background-color: ${({ theme }) => theme.colors.transparentGrey};
  }
`;
