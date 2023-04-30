import React from 'react';
import styled from 'styled-components';
import { AppWrapper } from '../AppWrapper';
import { Rnd } from 'react-rnd';

type ChromeProps = { isFocused: boolean };

function Chrome(props: ChromeProps) {
  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      Chrome
    </AppWrapper>
  );
}

export default Chrome;

export const Chrome_RND_CONFIG = {
  default: {
    width: 700,
    height: 700,
    x: 250,
    y: 200,
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

// const Wrapper = styled.div`
//   height: 100%;
//   border-radius: inherit;

// `;

const TopBar = styled.div``;
