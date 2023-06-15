import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import Color from 'color';

import { AppWrapper } from '../AppWrapper';

type TerminalProps = { isFocused: boolean };

function Terminal(props: TerminalProps) {
  const [inputLineHistory, setInputLineHistory] = React.useState<string[]>([]);
  const [currentInputLine, setCurrentInputLine] = React.useState<string>('');

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key == 'Enter') {
      setInputLineHistory((prevEntries) => [...prevEntries, currentInputLine]);
      setCurrentInputLine('');
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentInputLine(e.target.value);
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <TerminalViewContainer>
        {inputLineHistory.map((entry) => (
          <TerminalInputEntry input={entry} />
        ))}

        <TerminalLineContainer>
          <ArrowWrapper>➜</ArrowWrapper>
          <TildaWrapper>~</TildaWrapper>
          <TerminalInput
            onChange={handleInputChange}
            value={currentInputLine}
            onKeyDown={handleKeyDown}
          />
        </TerminalLineContainer>
      </TerminalViewContainer>
    </AppWrapper>
  );
}

export default Terminal;

export const Terminal_RND_CONFIG = {
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

const TerminalViewContainer = styled.div`
  height: 100%;
  padding: 0.8rem;

  background-color: ${({ theme }) => theme.colors.terminalBackground};
  color: ${({ theme }) => theme.colors.primary};

  border-top: 1px solid
    ${({ theme }) =>
      Color(theme.name == 'light' ? theme.colors.grey : theme.colors.black)
        .alpha(0.4)
        .toString()};
`;

const TerminalLineContainer = styled.div`
  display: flex;
  height: 1.2rem;
`;

const ArrowWrapper = styled.span`
  line-height: 100%;

  color: ${({ theme }) => theme.colors.neonGreen};
`;

const TildaWrapper = styled.span`
  line-height: 100%;
  font-size: 1.2rem;

  margin-left: 0.8rem;
  margin-right: 0.3rem;

  color: ${({ theme }) => theme.colors.cyan};
`;

const TerminalInput = styled.input`
  width: 100%;
  background: inherit;
  color: inherit;
  border: none;

  font-size: 1.1rem;
  font-family: ui-monospace, 'Cascadia Mono', 'Segoe UI Mono', 'Liberation Mono',
    Menlo, Monaco, Consolas, monospace;

  caret-color: ${({ theme }) => theme.colors.primary};

  &:focus-visible {
    outline: none;
  }
`;

type TerminalInputEntryProps = { input: string };
function TerminalInputEntry(props: TerminalInputEntryProps) {
  return (
    <TerminalLineContainer>
      <ArrowWrapper>➜</ArrowWrapper>
      <TildaWrapper>~</TildaWrapper>
      <TerminalInput value={props.input} disabled={true} />
    </TerminalLineContainer>
  );
}
