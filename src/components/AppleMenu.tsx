import { useActor } from '@xstate/react';
import styled from 'styled-components';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TiVendorApple } from 'react-icons/ti';

import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';

import { TopBarButton } from './TopBar';

function AppleMenu() {
  const { desktopService } = useGlobalServices();
  const [, send] = useActor(desktopService);

  function handleAboutThisMacClick() {
    send({ type: 'WINDOW.OPEN', name: 'aboutThisMac' });
  }

  function handleAboutThisEngineerClick() {
    send({ type: 'WINDOW.OPEN', name: 'aboutThisEngineer' });
  }

  function handleLogOutClick() {
    send({ type: 'AUTHENTICATION.LOGOUT' });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <TopBarButton
          style={{
            fontSize: '2rem',
          }}
        >
          <TiVendorApple />
        </TopBarButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <StyledMenuContent align="start" sideOffset={2}>
          <StyledMenuItem onClick={handleAboutThisMacClick}>
            About This Mac
          </StyledMenuItem>

          <StyledSeparator />

          <StyledMenuItem onClick={handleAboutThisEngineerClick}>
            About This Engineer
          </StyledMenuItem>

          <StyledMenuItem onClick={handleLogOutClick}>
            Log Out Tucker...
          </StyledMenuItem>
        </StyledMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default AppleMenu;

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
