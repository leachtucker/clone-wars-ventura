import styled from 'styled-components';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { TopBarButton } from './TopBar';
import Toggles from './icons/Toggles';

function ControlPanelDropdown() {
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
          <PanelSection>PanelSection</PanelSection>
          <PanelSection>PanelSection</PanelSection>

          <PanelSection>PanelSection</PanelSection>
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
  width: 32rem;
`;

const PanelSection = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);

  border-radius: 10px;
  padding: 0.5rem 1rem;
`;
