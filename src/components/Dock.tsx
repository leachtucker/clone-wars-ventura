import React from 'react';
import styled from 'styled-components';
import Trash from './icons/Trash';

import type { Window } from '../machines/desktop.machine';
import { applicationMinimizedImgMap } from './apps';
import Button from './Button';

type DockProps = {
  minimizedWindows: Window[];
  onMinimizedWindowClick: (windowId: string) => void;
};

function Dock({ minimizedWindows, onMinimizedWindowClick }: DockProps) {
  return (
    <Container>
      <Wrapper>
        <IconsGutter>
          <IconsContainer>
            <Button>
              <div>Dock</div>
            </Button>
          </IconsContainer>

          <Separator style={{ margin: '0 1.2rem' }} />

          <IconsContainer>
            {minimizedWindows.map((win) => {
              const applicationImg = applicationMinimizedImgMap[win.name];

              return (
                <Button
                  key={win.id}
                  onClick={() => onMinimizedWindowClick(win.id)}
                  style={{ height: '100%' }}
                >
                  <img src={applicationImg} style={{ height: '100%' }} />
                </Button>
              );
            })}
          </IconsContainer>

          <Button>
            <Trash style={{ height: '100%' }} />
          </Button>
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
  z-index: 1;
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
