import React from 'react';
import styled from 'styled-components';

import { AppWrapper } from './AppWrapper';
import macbookImg from '../../assets/macbook.png';

type AboutThisMacProps = { isFocused: boolean };

function AboutThisMac(props: AboutThisMacProps) {
  return (
    <AppWrapper isFocused={props.isFocused}>
      <Container>
        <Macbook style={{ pointerEvents: 'none' }} />

        <span
          style={{
            fontWeight: 700,
            fontSize: '2.3rem',
            marginTop: '4rem',
          }}
        >
          MacBook Pro
        </span>
        <span style={{ marginTop: '0.5rem' }}>16-inch, 2019</span>

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
    </AppWrapper>
  );
}

export default AboutThisMac;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary};
`;

const Macbook = styled.img.attrs({ src: macbookImg })`
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
