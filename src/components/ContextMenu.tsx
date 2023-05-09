import styled from 'styled-components';
import * as RadixContextMenu from '@radix-ui/react-context-menu';

const ContextMenu = () => {
  return (
    <StyledContent>
      <StyledItem>Clean Up</StyledItem>
    </StyledContent>
  );
};

export default ContextMenu;

const StyledContent = styled(RadixContextMenu.Content)`
  width: 24rem;
  border-radius: 8px;
  padding: 0.6rem;

  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledItem = styled(RadixContextMenu.Item)`
  cursor: default;
  font-size: 1.25rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.selection};
    color: ${({ theme }) => theme.colors.selectionContrast};
  }
`;
