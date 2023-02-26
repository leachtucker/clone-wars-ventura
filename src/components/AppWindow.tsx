import React from 'react';
import styled from 'styled-components';

type AppWindowProps = {
  title: string;
  zIndex: number | null;
  xPos: number;
  yPos: number;
};

function AppWindow(props: AppWindowProps & React.PropsWithChildren) {
  return (
    <Wrapper
      zIndex={props.zIndex}
      left={`${props.xPos}px`}
      top={`${props.yPos}px`}
    >
      <TopBarWrapper>{props.title}</TopBarWrapper>
    </Wrapper>
  );
}

export default AppWindow;

const Wrapper = styled.div<{
  zIndex: number | null;
  left: string;
  top: string;
}>`
  z-index: ${(props) => props.zIndex ?? 'auto'};
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};

  width: 500px;
  height: 500px;

  background-color: grey;
`;

const TopBarWrapper = styled.div`
  height: 35px;
  background-color: ${({ theme }) => theme.colors.background};
`;
