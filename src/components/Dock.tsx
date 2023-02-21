import React from 'react';
import styled from 'styled-components';

function Dock() {
  return (
    <Container>
      <Wrapper>Dock</Wrapper>
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
  width: 80%;

  color: white;
  background-color: rgb(240, 240, 240, 0.3);
  backdrop-filter: blur(50px);

  display: flex;
  align-items: center;

  padding: 0 15px;

  border-radius: 20px;
`;
