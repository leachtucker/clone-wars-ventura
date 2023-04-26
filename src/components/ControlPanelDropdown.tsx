import React from 'react';
import styled, { css } from 'styled-components';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Ramda from 'ramda';

import { BsWifi2 } from 'react-icons/bs';

import { TopBarButton } from './TopBar';
import Toggles from './icons/Toggles';
import RoundIconButton from './RoundIconButton';

function ControlPanelDropdown() {
  const [isWifiOn, setIsWifiOn] = React.useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = React.useState(true);
  const [isAirDropOn, setIsAirDropOn] = React.useState(true);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <TopBarButton
          style={{
            fontSize: '1.4rem',
          }}
        >
          <Toggles />
        </TopBarButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <StyledMenuContent sideOffset={6}>
          <PanelGrid>
            <PanelGroup
              style={{
                gridColumn: 'span 2',
                display: 'flex',
                flexDirection: 'column',
                gridGap: '1.2rem',
                padding: '1.2rem 0.8rem',
              }}
            >
              <PanelItemSmall style={{}}>
                <PanelButton
                  icon={<BsWifi2 />}
                  isActive={isWifiOn}
                  onClick={() => setIsWifiOn(toggleBoolean)}
                >
                  <PanelItemMainText>Wi-Fi</PanelItemMainText>
                  <PanelItemSubText>
                    {isWifiOn ? '1337 Network' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>

              <PanelItemSmall>
                <PanelButton
                  icon={<BsWifi2 />}
                  isActive={isBluetoothOn}
                  onClick={() => setIsBluetoothOn(toggleBoolean)}
                >
                  <PanelItemMainText>Bluetooth</PanelItemMainText>
                  <PanelItemSubText>
                    {isBluetoothOn ? 'On' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>

              <PanelItemSmall>
                <PanelButton
                  icon={<BsWifi2 />}
                  isActive={isAirDropOn}
                  onClick={() => setIsAirDropOn(toggleBoolean)}
                >
                  <PanelItemMainText>AirDrop</PanelItemMainText>
                  <PanelItemSubText>
                    {isAirDropOn ? 'On' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>
            </PanelGroup>

            <PanelGroup style={{ gridColumn: 'span 2' }}>PanelGroup</PanelGroup>

            <PanelGroup style={{ gridColumn: 'span 2' }}>PanelGroup</PanelGroup>

            <PanelGroup style={{ gridColumn: 'span 1' }}>PanelGroup</PanelGroup>
            <PanelGroup style={{ gridColumn: 'span 1' }}>PanelGroup</PanelGroup>
          </PanelGrid>
        </StyledMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default ControlPanelDropdown;

const StyledMenuContent = styled(DropdownMenu.Content)`
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  backdrop-filter: blur(65px);
  border-radius: 5px;

  padding: 0.6rem;
  width: 31rem;
`;

const PanelGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);

  grid-gap: 0.8rem;
`;

const PanelGroup = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);

  border-radius: 10px;
  padding: 0.5rem 1rem;
`;

const PanelItemSmall = styled.div`
  display: flex;
  grid-gap: 0.8rem;
`;

type PanelButtonProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof PanelIconButton>;
const PanelButton = ({ icon, children, ...props }: PanelButtonProps) => {
  return (
    <>
      <PanelIconButton {...props}>{icon}</PanelIconButton>
      <div>{children}</div>
    </>
  );
};

const PanelItemMainText = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
`;

const PanelItemSubText = styled.span`
  color: ${({ theme }) => theme.colors.almostBlack};
`;

type PanelIconButtonProps = { isActive?: boolean };
const PanelIconButton = styled(RoundIconButton)<PanelIconButtonProps>`
  color: ${({ theme }) => theme.colors.primary};

  ${(props) =>
    props.isActive &&
    css`
      opacity: 1;
      color: ${props.theme.colors.white};
      background-color: ${props.theme.colors.highlightBlue};
    `}

  padding: 0.2rem;

  & > svg {
    stroke-width: 0.5px;
  }
`;

const toggleBoolean = Ramda.not;
