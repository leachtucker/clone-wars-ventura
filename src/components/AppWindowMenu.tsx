import styled, { css } from 'styled-components';
import Button from './Button';
import { BsFillCircleFill } from 'react-icons/bs';
import { ActorRefFrom } from 'xstate';
import { DesktopWindowMachine } from '../machines/desktopWindow.machine';
import { useActor } from '@xstate/react';

type AppWindowMenuProps = { windowMachine: ActorRefFrom<DesktopWindowMachine> };

export function AppWindowMenu(props: AppWindowMenuProps) {
  const [, send] = useActor(props.windowMachine);

  const handleAppCloseClick: React.MouseEventHandler = () => {
    send('close');
  };

  const handleAppMinimizeClick: React.MouseEventHandler = () => {};

  return (
    <Container className="interactable">
      <Button onClick={handleAppCloseClick}>
        <AppCloseIcon />
      </Button>
      <Button>
        <AppMinimizeIcon onClick={handleAppMinimizeClick} />
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
