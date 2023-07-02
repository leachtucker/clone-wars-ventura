import React from 'react';
import styled from 'styled-components';
import * as Ramda from 'ramda';

import { AppWrapper } from '../AppWrapper';
import VimEditor from '../../VimEditor';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { useSelector } from '@xstate/react';
import { fileSystemSelector } from '../../../machines/desktop.machine';
import { FileDirectoryEntry } from '../../../shared/file-system';

type VimAppData = {
  fileDirectoryPath: string[];
};

type VimProps = { isFocused: boolean; id: string; appData: VimAppData };

function Vim(props: VimProps) {
  const { desktopService } = useGlobalServices();
  const fileSystem = useSelector(desktopService, fileSystemSelector);
  const fileDirEntry = Ramda.path(
    props.appData?.fileDirectoryPath,
    fileSystem
  ) as FileDirectoryEntry;

  console.log({ fileDirEntry });

  const closeVimApp = () =>
    desktopService.send({ type: 'WINDOW.CLOSE', id: props.id });

  const handleWriteQuit = (newContent: string) => {
    closeVimApp();

    desktopService.send({
      type: 'FILE_SYSTEM.DIRECTORY_ENTRY.MODIFY_CONTENT',
      path: props.appData.fileDirectoryPath,
      content: newContent,
    });
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <VimEditor
        initialValue={fileDirEntry.content}
        onQuit={closeVimApp}
        onWriteQuit={handleWriteQuit}
      />
    </AppWrapper>
  );
}

export default Vim;

const TopBar = styled.div`
  height: 3.1rem;
  background-color: ${({ theme }) => theme.colors.terminalTopBarBackground};
`;
