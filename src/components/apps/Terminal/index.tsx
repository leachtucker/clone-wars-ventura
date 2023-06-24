import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';
import Color from 'color';
import * as Ramda from 'ramda';

import { AppWrapper } from '../AppWrapper';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { handleOpenCommand, usePromptPath } from './prompt-helpers';
import {
  DirectoryEntry,
  FileDirectoryEntry,
} from '../../../shared/file-system';
import { isNotEmpty } from '../../../shared/utils/fp';
import { Show } from '../../primitives/Show';
import Vim from './Vim';

type TerminalProps = { isFocused: boolean };

function Terminal(props: TerminalProps) {
  const { desktopService } = useGlobalServices();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [terminalHistory, setTerminalHistory] = React.useState<
    TerminalHistoryEntry[]
  >([]);
  const [currentInputLine, setCurrentInputLine] = React.useState<string>('');

  const [vimMode, setVimMode] =
    React.useState<VimModeState>(initialVimModeState);

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
      case 'nvim': {
        const [fileName] = args;
        if (!fileName) {
          terminalHistoryEntry.output = `zsh: missing file name argument`;
          break;
        }

        const filePath = [...promptPath.currentPath, fileName];

        const fileSystem = desktopService.getSnapshot().context.fileSystem;
        const fileDirectoryEntry = Ramda.path<DirectoryEntry>(
          filePath,
          fileSystem
        );

        if (!fileDirectoryEntry || fileDirectoryEntry?.type != 'file') {
          terminalHistoryEntry.output = `zsh: invalid file name: ${fileName}`;
          break;
        }

        setVimMode({
          isActive: true,
          currentFile: { path: filePath, content: fileDirectoryEntry.content },
        });

        break;
      }
      case 'open': {
        const [appName] = args;
        try {
          handleOpenCommand(desktopService, appName);
          terminalHistoryEntry.output = `zsh: opening ${appName} app`;
        } catch (error: any) {
          terminalHistoryEntry.output = `zsh: ${error.message}`;
        }

        break;
      }
      case 'cd': {
        const [requestedPath] = args;
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
      case 'touch': {
        const [fullFileName] = args;

        // validate filename
        if (fullFileName.search(/[^[a-zA-Z0-9.]/g) != -1) {
          terminalHistoryEntry.output = `zsh: invalid file name: ${fullFileName}`;
          break;
        } else if (Ramda.isEmpty(fullFileName)) {
          terminalHistoryEntry.output = `zsh: touch command needs a file name arg`;
          break;
        }

        const split = fullFileName.split('.');
        const fileExtension = Ramda.last(split);
        const fileName = Ramda.init(split).join('.');

        const requestedPath = [...promptPath.currentPath, fullFileName];

        // check if file already exists
        const currentFileSystemState =
          desktopService.getSnapshot().context.fileSystem;

        if (Ramda.path(requestedPath, currentFileSystemState)) {
          terminalHistoryEntry.output = `zsh: file already exists: ${fullFileName}`;
          break;
        }

        const newDirectoryEntry = {
          type: 'file',
          name: fileName,
          fileExtension,
          icon: 'ds',
          content: '',
        } satisfies FileDirectoryEntry;

        desktopService.send({
          type: 'FILE_SYSTEM.CREATE_DIRECTORY_ENTRY',
          entry: newDirectoryEntry,
          path: requestedPath,
        });

        break;
      }
      case 'mkdir': {
        const [path] = args;
        const requestedRelativePath = path.split('/').filter(isNotEmpty);
        const requestedPath = [
          ...promptPath.currentPath,
          ...requestedRelativePath,
        ];

        if (Ramda.isEmpty(requestedRelativePath)) {
          terminalHistoryEntry.output = `zsh: invalid directory`;
          break;
        }

        desktopService.send({
          type: 'FILE_SYSTEM.CREATE_DIRECTORY_ENTRY',
          entry: {},
          path: requestedPath,
        });

        break;
      }
      case 'rm': {
        const [path] = args;
        const requestedRelativePath = path.split('/').filter(isNotEmpty);
        const requestedPath = [
          ...promptPath.currentPath,
          ...requestedRelativePath,
        ];

        desktopService.send({
          type: 'FILE_SYSTEM.REMOVE_DIRECTORY_ENTRY',
          path: requestedPath,
        });

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
      setTimeout(() => {
        if (inputRef.current)
          inputRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
      }, 0);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentInputLine(e.target.value);
  };

  function handleVimQuit() {
    setVimMode(initialVimModeState);
  }

  function handleVimWriteQuit(savedOutput: string) {
    if (vimMode.currentFile) {
      desktopService.send({
        type: 'FILE_SYSTEM.MODIFY_DIRECTORY_ENTRY_FILE_CONTENT',
        path: vimMode.currentFile.path,
        content: savedOutput,
      });
    }
    setVimMode(initialVimModeState);
  }

  return (
    <AppWrapper
      isFocused={props.isFocused}
      onClick={() => inputRef.current?.focus()}
    >
      <TopBar />
      <Show when={vimMode.isActive}>
        <TerminalContentContainer>
          <Vim
            onQuit={handleVimQuit}
            onWriteQuit={handleVimWriteQuit}
            initialValue={vimMode.currentFile?.content ?? ''}
          />
        </TerminalContentContainer>
      </Show>

      <Show when={!vimMode.isActive}>
        <TerminalPromptContainer>
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
        </TerminalPromptContainer>
      </Show>
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

const TerminalContentContainer = styled.div`
  height: calc(100% - 3.1rem);
  overflow-y: auto;
`;

const TerminalPromptContainer = styled(TerminalContentContainer)`
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

type VimModeState = {
  isActive: boolean;
  currentFile: { path: string[]; content: string } | null | null;
};

const initialVimModeState = {
  isActive: false,
  currentFile: null,
} satisfies VimModeState;
