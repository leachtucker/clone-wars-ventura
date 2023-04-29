import React from 'react';
import styled, { css } from 'styled-components';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Ramda from 'ramda';
import Color from 'color';

import {
  BiWifi2,
  BiBluetooth,
  BiStation,
  BiMoon,
  BiWindow,
  BiWindows,
} from 'react-icons/bi';

import { TopBarButton } from './TopBar';
import Toggles from './icons/Toggles';
import RoundIconButton from './RoundIconButton';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { useSelector } from '@xstate/react';
import { isThemeDarkSelector } from '../machines/desktop.machine';

function ControlPanelDropdown() {
  const [isWifiOn, setIsWifiOn] = React.useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = React.useState(true);
  const [isAirDropOn, setIsAirDropOn] = React.useState(true);

  const { desktopService } = useGlobalServices();
  const isThemeDark = useSelector(desktopService, isThemeDarkSelector);

  function handleThemeClick() {
    desktopService.send({ type: 'THEME.TOGGLE' });
  }

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
                gridRow: 'span 3',
                display: 'flex',
                flexDirection: 'column',
                gridGap: '1rem',
                padding: '1.2rem 0.8rem',
              }}
            >
              <PanelItemSmall>
                <PanelButton
                  icon={
                    <BiWifi2
                      style={{ strokeWidth: '0.5px', fontSize: '1.8rem' }}
                    />
                  }
                  isActive={isWifiOn}
                  onClick={() => setIsWifiOn(toggleBoolean)}
                >
                  <PanelItemMainText style={{ marginBottom: '0.4rem' }}>
                    Wi-Fi
                  </PanelItemMainText>
                  <PanelItemSubText>
                    {isWifiOn ? '1337 Network' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>

              <PanelItemSmall>
                <PanelButton
                  icon={<BiBluetooth style={{ fontSize: '1.7rem' }} />}
                  isActive={isBluetoothOn}
                  onClick={() => setIsBluetoothOn(toggleBoolean)}
                >
                  <PanelItemMainText style={{ marginBottom: '0.4rem' }}>
                    Bluetooth
                  </PanelItemMainText>
                  <PanelItemSubText>
                    {isBluetoothOn ? 'On' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>

              <PanelItemSmall>
                <PanelButton
                  icon={<BiStation style={{ fontSize: '1.7rem' }} />}
                  isActive={isAirDropOn}
                  onClick={() => setIsAirDropOn(toggleBoolean)}
                >
                  <PanelItemMainText style={{ marginBottom: '0.4rem' }}>
                    AirDrop
                  </PanelItemMainText>
                  <PanelItemSubText>
                    {isAirDropOn ? 'On' : 'Off'}
                  </PanelItemSubText>
                </PanelButton>
              </PanelItemSmall>
            </PanelGroup>

            <PanelGroup
              style={{
                gridColumn: 'span 2',
                display: 'flex',
                alignItems: 'center',
                gridGap: '0.4rem',
                padding: '1.2rem 0.8rem',
              }}
            >
              <PanelButton
                icon={<BiMoon style={{ fontSize: '1.7rem' }} />}
                isActive={isThemeDark}
                onClick={handleThemeClick}
              />
              <PanelItemMainText>Dark Mode</PanelItemMainText>
            </PanelGroup>

            <WindowPanelGroup
              style={{
                gridColumn: 'span 1',
                gridRow: 'span 2',
              }}
            >
              <BiWindow style={{ fontSize: '2rem' }} />
              <span style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                Stage Manager
              </span>
            </WindowPanelGroup>
            <WindowPanelGroup
              style={{
                gridColumn: 'span 1',
                gridRow: 'span 2',
              }}
            >
              <BiWindows style={{ fontSize: '2rem' }} />
              <span style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                Screen Mirroring
              </span>
            </WindowPanelGroup>
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
  border-radius: 14px;

  padding: 0.6rem;
  width: 31rem;
  height: 13rem;
`;

const PanelGrid = styled.div`
  display: grid;
  height: 100%;

  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);

  grid-gap: 0.8rem;
`;

const PanelGroup = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);

  border-radius: 10px;
  padding: 0.5rem 1rem;
`;

const WindowPanelGroup = styled(PanelGroup)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

const PanelItemSmall = styled.div`
  display: flex;
  grid-gap: 0.8rem;
`;

type PanelButtonProps = {
  icon: React.ReactNode;
  children?: React.ReactNode;
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
`;

const PanelItemSubText = styled.span`
  color: ${(props) =>
    (props.theme.name == 'light'
      ? Color(props.theme.colors.primary).lighten(0.3)
      : Color(props.theme.colors.primary).darken(0.3)
    ).toString()};
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

  stroke-width: 0.3px;
`;

const toggleBoolean = Ramda.not;
