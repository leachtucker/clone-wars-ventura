import React from 'react';
import { Rnd } from 'react-rnd';

import { AppWrapper } from '../AppWrapper';
import styled from 'styled-components';
import { getWindowStartingPosition } from '../app-config-mappings';

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
  minWidth: 500,
  minHeight: 290,
  default: {
    width: 640,
    height: 370,
    ...getWindowStartingPosition(640, 370),
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const TopBar = styled.div`
  height: 3.1rem;
  background-color: ${({ theme }) => theme.colors.terminalTopBarBackground};
`;
