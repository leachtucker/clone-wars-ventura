import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import Color from 'color';

import { AppWrapper } from '../AppWrapper';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { handleOpenCommand } from './prompt-helpers';

type TerminalProps = { isFocused: boolean };

function Terminal(props: TerminalProps) {
  const { desktopService } = useGlobalServices();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [terminalHistory, setTerminalHistory] = React.useState<
    TerminalHistoryEntry[]
  >([]);
  const [currentInputLine, setCurrentInputLine] = React.useState<string>('');

  function handleTerminalInput(
    input: string
  ): TerminalHistoryEntry | undefined {
    const [command, ...args] = input.toLowerCase().split(' ');

    switch (command) {
      case 'open': {
        const appName = args?.[0];
        try {
          handleOpenCommand(desktopService, appName);
          return { input, output: `zsh: opening ${appName} app` };
        } catch (e) {
          return { input, output: `zsh: app not found: ${appName}` };
        }
      }
      case 'clear': {
        setTerminalHistory([]);
        break;
      }
      default: {
        return { input, output: `zsh: command not found: ${input}` };
      }
    }
  }

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key == 'Enter') {
      const terminalEntry = handleTerminalInput(currentInputLine);
      if (terminalEntry) {
        setTerminalHistory((prevEntries) => [...prevEntries, terminalEntry]);
      }

      setCurrentInputLine('');
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentInputLine(e.target.value);
  };

  return (
    <AppWrapper
      isFocused={props.isFocused}
      onClick={() => inputRef.current?.focus()}
    >
      <TopBar />
      <TerminalPrompt>
        {terminalHistory.map((entry, idx) => (
          <React.Fragment key={idx}>
            <TerminalInputEntry input={entry.input} />
            <TerminalLineContainer style={{ marginTop: '0.1rem' }}>
              {entry.output}
            </TerminalLineContainer>
          </React.Fragment>
        ))}

        <TerminalLineContainer style={{ marginTop: '0.2rem' }}>
          <ArrowWrapper>➜</ArrowWrapper>
          <TildaWrapper>~</TildaWrapper>
          <TerminalInput
            onChange={handleInputChange}
            value={currentInputLine}
            onKeyDown={handleKeyDown}
            className="interactable"
            autoFocus
            ref={inputRef}
          />
        </TerminalLineContainer>
      </TerminalPrompt>
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

const TerminalPrompt = styled.div`
  height: 100%;
  padding: 0.8rem;

  background-color: ${({ theme }) => theme.colors.terminalBackground};
  color: ${({ theme }) => theme.colors.primary};

  font-size: 1.1rem;
  font-family: ui-monospace, 'Cascadia Mono', 'Segoe UI Mono', 'Liberation Mono',
    Menlo, Monaco, Consolas, monospace;

  border-top: 1px solid
    ${({ theme }) =>
      Color(theme.name == 'light' ? theme.colors.grey : theme.colors.black)
        .alpha(0.4)
        .toString()};
`;

const TerminalLineContainer = styled.div`
  display: flex;
`;

const ArrowWrapper = styled.span`
  line-height: 100%;

  color: ${({ theme }) => theme.colors.neonGreen};
`;

const TildaWrapper = styled.span`
  line-height: 100%;
  font-size: 1.2rem;
  font-weight: bold;

  margin-left: 0.6rem;
  margin-right: 0.3rem;

  color: ${({ theme }) => theme.colors.cyan};
`;

const TerminalInput = styled.input`
  width: 100%;
  background: inherit;
  color: inherit;
  border: none;

  font-family: inherit;
  font-size: inherit;

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

type TerminalHistoryEntry = {
  input: string;
  output: string;
};
