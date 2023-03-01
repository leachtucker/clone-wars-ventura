import React from 'react';
import styled, { css } from 'styled-components';
import macbook from '../../assets/macbook.png';

type AboutThisMacProps = { isFocused: boolean };

function AboutThisMac(props: AboutThisMacProps) {
  return (
    <Wrapper isFocused={props.isFocused}>
      <Container>
        <Macbook />
        <span
          style={{
            fontWeight: 700,
            fontSize: '2.3rem',
            color: 'rgb(45, 42, 41)',
            marginTop: '4rem',
          }}
        >
          MacBook Pro
        </span>
        <span style={{ color: 'rgb(45, 42, 41, 0.6)', marginTop: '0.5rem' }}>
          16-inch, 2019
        </span>
        <MacInfoGrid>
          <MacInfoLabel>Processor</MacInfoLabel>
          <MacInfoContent>2.3 GHz 8-Core Intel Core i9</MacInfoContent>

          <MacInfoLabel>Graphics</MacInfoLabel>
          <div>
            <MacInfoContent>AMD Radeon Pro 5500M 4 GB</MacInfoContent>
            <br />
            <MacInfoContent>Intel UHD Graphics 630 1536 MB</MacInfoContent>
          </div>

          <MacInfoLabel>Memory</MacInfoLabel>
          <MacInfoContent>16 GB 2667 MHz DDR4</MacInfoContent>

          <MacInfoLabel>Startup disk</MacInfoLabel>
          <MacInfoContent>Macintosh HD</MacInfoContent>

          <MacInfoLabel>Serial number</MacInfoLabel>
          <MacInfoContent>1337</MacInfoContent>

          <MacInfoLabel>macOS</MacInfoLabel>
          <MacInfoContent>Ventura 13.1</MacInfoContent>
        </MacInfoGrid>
      </Container>
    </Wrapper>
  );
}

export default AboutThisMac;

export const AboutThisMac_RND_CONFIG = {
  default: {
    width: 280,
    height: 450,
  },
  enableResizing: false,
};

const Wrapper = styled.div<{ isFocused: boolean }>`
  height: 100%;

  backdrop-filter: blur(65px);
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: inherit;

  ${(props) =>
    props.isFocused &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundTransparent};
    `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Macbook = styled.img.attrs({ src: macbook })`
  width: 17rem;
  margin-top: 7rem;
`;

const MacInfoGrid = styled.div`
  margin-top: 2rem;
  width: 79%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.7rem 1rem;

  font-size: 1.1rem;
`;

const MacInfoLabel = styled.span`
  text-align: right;
  white-space: nowrap;
`;

const MacInfoContent = styled.span``;
