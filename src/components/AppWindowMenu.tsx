import styled, { css } from 'styled-components';
import { BsFillCircleFill } from 'react-icons/bs';

import { useActor } from '@xstate/react';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';

import Button from './Button';

type AppWindowMenuProps = { windowId: string };

export function AppWindowMenu(props: AppWindowMenuProps) {
  const { desktopService } = useGlobalServices();
  const [, send] = useActor(desktopService);

  const handleAppCloseClick = () =>
    send({ type: 'WINDOW.CLOSE', id: props.windowId });

  const handleAppMinimizeClick = () =>
    send({ type: 'WINDOW.MINIMIZE', id: props.windowId });

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
