import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import Color from 'color';
import * as Ramda from 'ramda';

import { AppWrapper } from '../AppWrapper';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { handleOpenCommand, usePromptPath } from './prompt-helpers';

type TerminalProps = { isFocused: boolean };

function Terminal(props: TerminalProps) {
  const { desktopService } = useGlobalServices();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [terminalHistory, setTerminalHistory] = React.useState<
    TerminalHistoryEntry[]
  >([]);
  const [currentInputLine, setCurrentInputLine] = React.useState<string>('');

  // * File system state
  const promptPath = usePromptPath();

  function handleTerminalInput(input: string): TerminalHistoryEntry {
    const [command, ...args] = input.toLowerCase().trim().split(' ');
    const terminalHistoryEntry: TerminalHistoryEntry = {
      input,
      workingDirPath: promptPath.currentPath,
      output: undefined,
    };

    switch (command) {
      case 'open': {
        const appName = args?.[0];
        try {
          handleOpenCommand(desktopService, appName);
          terminalHistoryEntry.output = `zsh: opening ${appName} app`;
        } catch (error: any) {
          terminalHistoryEntry.output = `zsh: ${error.message}`;
        }

        break;
      }
      case 'cd': {
        const requestedPath = args?.[0];
        try {
          promptPath.goTo(requestedPath);
        } catch (error: any) {
          terminalHistoryEntry.output = `zsh: ${error.message}`;
        }

        break;
      }
      case 'ls': {
        terminalHistoryEntry.output = promptPath
          .listWorkingDirectory()
          .join('   ');

        break;
      }
      case 'clear': {
        setTerminalHistory([]);
        break;
      }
      default: {
        terminalHistoryEntry.output = `zsh: command not found: ${input}`;
      }
    }

    return terminalHistoryEntry;
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

  console.log({ terminalHistory, currPath: promptPath.currentPath });

  return (
    <AppWrapper
      isFocused={props.isFocused}
      onClick={() => inputRef.current?.focus()}
    >
      <TopBar />
      <TerminalPrompt>
        {terminalHistory.map((entry, idx) => (
          <React.Fragment key={idx}>
            <TerminalInputEntry
              input={entry.input}
              workingDirPath={entry.workingDirPath}
            />

            {entry.output && (
              <TerminalLineContainer style={{ marginTop: '0.1rem' }}>
                {entry.output}
              </TerminalLineContainer>
            )}
          </React.Fragment>
        ))}

        <TerminalLineContainer style={{ marginTop: '0.2rem' }}>
          <ArrowWrapper>➜</ArrowWrapper>
          <DirectoryWrapper>
            {Ramda.last(promptPath.currentPath) ?? '~'}
          </DirectoryWrapper>
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
  padding: 0.2rem 0;

  color: ${({ theme }) => theme.colors.neonGreen};
`;

const DirectoryWrapper = styled.span`
  line-height: 100%;
  font-size: 1.1rem;
  font-weight: bold;

  padding: 0.2rem 0;
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

type TerminalInputEntryProps = { input: string; workingDirPath: string[] };
function TerminalInputEntry(props: TerminalInputEntryProps) {
  console.log({ tail: Ramda.tail(props.workingDirPath) });
  return (
    <TerminalLineContainer>
      <ArrowWrapper>➜</ArrowWrapper>
      <DirectoryWrapper>
        {Ramda.last(props.workingDirPath) || '~'}
      </DirectoryWrapper>

      <TerminalInput value={props.input} disabled={true} />
    </TerminalLineContainer>
  );
}

type TerminalHistoryEntry = {
  input: string;
  output: string | undefined;
  workingDirPath: string[];
};
