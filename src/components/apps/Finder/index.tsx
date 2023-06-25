import React from 'react';
import { Rnd } from 'react-rnd';

import { AppWrapper } from '../AppWrapper';
import styled from 'styled-components';

type FinderProps = {
  isFocused: boolean;
};

function Finder(props: FinderProps) {
  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      Finder
    </AppWrapper>
  );
}

export default Finder;

export const FINDER_RND_CONFIG = {
  minWidth: 160,
  minHeight: 100,
  default: {
    width: 570,
    height: 360,
    x: 100,
    y: 100,
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const TopBar = styled.div`
  height: 3.1rem;
  background-color: ${({ theme }) => theme.colors.terminalTopBarBackground};
`;
