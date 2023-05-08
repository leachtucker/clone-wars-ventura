import React from 'react';
import styled from 'styled-components';
import Trash from './icons/Trash';

import type { Window } from '../machines/desktop.machine';
import {
  ApplicationName,
  applicationDockIconMap,
  applicationMinimizedImgMap,
} from './apps';
import Button from './Button';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';

type DockProps = {
  minimizedWindows: Window[];
  onMinimizedWindowClick: (windowId: string) => void;
};

function Dock({ minimizedWindows, onMinimizedWindowClick }: DockProps) {
  const { desktopService } = useGlobalServices();

  function createIconClickHandler(appName: ApplicationName) {
    return function handleIconClick() {
      desktopService.send({ type: 'WINDOW.OPEN', name: appName });
    };
  }

  return (
    <Container>
      <Wrapper>
        <IconsGutter>
          <IconsContainer>
            {Object.entries(applicationDockIconMap).map(
              ([appName, appIconImg]) => (
                <DockIconButton
                  onClick={createIconClickHandler(appName as ApplicationName)}
                  key={appName}
                >
                  <img src={appIconImg} alt={appName} />
                </DockIconButton>
              )
            )}
          </IconsContainer>

          <Separator style={{ margin: '0 1.2rem' }} />

          <IconsContainer>
            {minimizedWindows.map((win) => {
              const applicationImg = applicationMinimizedImgMap[win.name];

              return (
                <DockIconButton
                  key={win.id}
                  onClick={() => onMinimizedWindowClick(win.id)}
                  style={{ height: '100%' }}
                >
                  <img
                    src={applicationImg}
                    style={{ height: '100%', borderRadius: '8px' }}
                  />
                </DockIconButton>
              );
            })}
          </IconsContainer>

          <DockIconButton>
            <Trash />
          </DockIconButton>
        </IconsGutter>
      </Wrapper>
    </Container>
  );
}

export default Dock;

const Container = styled.div`
  width: 100%;
  position: absolute;
  bottom: 6px;

  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  z-index: 1500;
  height: 75px;

  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.backgroundTransparent};
  backdrop-filter: blur(50px);

  display: flex;
  align-items: center;

  padding: 0 1rem;
  border-radius: 20px;
`;

const IconsGutter = styled.div`
  height: 70%;
  margin: auto;

  display: flex;
  align-items: center;

  & > * {
    height: 100%;
  }
`;

const IconsContainer = styled.div`
  margin: auto;

  display: flex;
  gap: 0 1rem;
  align-items: center;
`;

const Separator = styled.div`
  height: 100%;
  width: 1px;
  background: rgba(255, 255, 255, 0.3);
`;

const DockIconButton = styled(Button)`
  display: block;
  padding: 0;
  height: 100%;

  & > img {
    height: 100%;
    width: auto;
  }

  &:active {
    filter: brightness(80%);
    transform: scale3d(0.97, 0.97, 1);
  }
`;
