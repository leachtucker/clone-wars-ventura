import styled from 'styled-components';

import { useActor } from '@xstate/react';

import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';

import { TiVendorApple } from 'react-icons/ti';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import Button from '../components/Button';
import Toggles from './icons/Toggles';
import themes from '../shared/config/themes';

function TopBar() {
  const now = new Date();

  return (
    <Wrapper>
      <LeftRightContainer>
        <AppleMenu />
      </LeftRightContainer>

      <LeftRightContainer>
        <Button style={{ fontSize: '1.4rem' }}>
          <Toggles />
        </Button>

        <SimpleDate date={now} />
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
`;

type SimpleDateProps = { date: Date };
function SimpleDate({ date }: SimpleDateProps) {
  return (
    <DateWrapper>
      {WeekDayIntlDateTimeFormat.format(date)} {IntlDateTimeFormat.format(date)}
    </DateWrapper>
  );
}

const WeekDayIntlDateTimeFormat = new Intl.DateTimeFormat('default', {
  weekday: 'short',
});

const IntlDateTimeFormat = new Intl.DateTimeFormat('default', {
  month: 'short',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
});

const DateWrapper = styled.span`
  font-size: 1.2rem;
`;

function AppleMenu() {
  const { desktopService } = useGlobalServices();
  const [, send] = useActor(desktopService);

  function handleAboutThisMac() {
    send({ type: 'WINDOW.OPEN', name: 'Test' });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button style={{ fontSize: '2rem' }}>
          <TiVendorApple />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <StyledMenuContent
          sideOffset={TOPBAR_HEIGHT_PX}
          align="start"
          alignOffset={15}
          avoidCollisions={false}
        >
          <StyledMenuItem onClick={handleAboutThisMac}>
            About This Mac
          </StyledMenuItem>
          <StyledSeparator />
          <StyledMenuItem>About This Engineer</StyledMenuItem>
          <StyledMenuItem>Log Out Tucker...</StyledMenuItem>
        </StyledMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const StyledMenuContent = styled(DropdownMenu.Content)`
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  backdrop-filter: blur(65px);
  border-radius: 5px;

  padding: 0.6rem;
  width: 24rem;
`;

const StyledMenuItem = styled(DropdownMenu.Item)`
  cursor: default;
  font-size: 1.25rem;
  padding: 0.5rem 1rem;
  border-radius: 3px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.selectionContrast};
  }
`;

const StyledSeparator = styled(DropdownMenu.Separator)`
  width: 92%;
  height: 1px;
  margin: 0.4rem auto;
  background-color: ${({ theme }) => theme.colors.grey};
`;
