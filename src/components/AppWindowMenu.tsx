import styled, { css } from 'styled-components';
import { BsFillCircleFill } from 'react-icons/bs';

import Button from './primitives/Button';

type AppWindowMenuProps = {
  onCloseClick: () => void;
  onMinimizeClick: () => void;
};

export function AppWindowMenu(props: AppWindowMenuProps) {
  return (
    <Container className="interactable">
      <Button onClick={props.onCloseClick}>
        <AppCloseIcon />
      </Button>

      <Button>
        <AppMinimizeIcon onClick={props.onMinimizeClick} />
      </Button>

      <AppWindowActionIcon disabled />
    </Container>
  );
}

export default AppWindowMenu;

const Container = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  width: fit-content;
  position: absolute;
  top: 0;
`;

const AppWindowActionIcon = styled(BsFillCircleFill)<{ disabled?: boolean }>`
  font-size: 1.2rem;
  border-radius: 50%;
  filter: drop-shadow(0px 0px 0.2px #3e3b3bde);

  ${({ disabled }) =>
    disabled &&
    css`
      && {
        color: rgb(220, 217, 216);
      }
    `}
`;

const AppCloseIcon = styled(AppWindowActionIcon)`
  color: rgb(255, 95, 87);
`;

const AppMinimizeIcon = styled(AppWindowActionIcon)`
  color: rgb(254, 188, 47);
`;
