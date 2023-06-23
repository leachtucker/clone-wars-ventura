import React from 'react';
import * as Ramda from 'ramda';

import { ActorRefFrom } from 'xstate';
import { useSelector } from '@xstate/react';

import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import {
  DesktopMachine,
  fileSystemSelector,
} from '../../../machines/desktop.machine';

import { Directory, LeafDirectoryEntry } from '../../../shared/file-system';
import {
  ApplicationName,
  // applicationComponentMap,
} from '../app-config-mappings';

export function handleOpenCommand(
  service: ActorRefFrom<DesktopMachine>,
  appName: string
) {
  // Todo: fix dep cycle
  // const validAppNames = Object.keys(applicationComponentMap);
  const validAppNames = ['chrome', 'terminal'];
  if (validAppNames.includes(appName)) {
    service.send({ type: 'WINDOW.OPEN', name: appName as ApplicationName });
  }

  throw Error(`app not found: ${appName}`);
}

export function usePromptPath() {
  const { desktopService } = useGlobalServices();
  const currentFileSystemDirectory = useSelector(
    desktopService,
    fileSystemSelector
  );
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);

  const goBack = () => {
    if (currentPath.length == 0) {
      // Prompt is at top-level dir, do nothing
      return;
    }

    setCurrentPath(Ramda.init);
  };

  const goTo = (requestedPath: string | undefined) => {
    if (requestedPath == undefined || Ramda.isEmpty(requestedPath)) {
      return;
    }

    if (requestedPath == '..') {
      goBack();
      return;
    }

    const requestedSubdirectoryPathArr = requestedPath
      .split('/')
      .filter(isNotEmpty);

    const requestedPathArr = [...currentPath, ...requestedSubdirectoryPathArr];
    const requestedDirectoryEntry = Ramda.path(
      requestedPathArr,
      currentFileSystemDirectory
    ) as undefined | Directory[keyof Directory];

    if (requestedDirectoryEntry == undefined) {
      throw new Error(`no such file or directory: ${requestedPath}`);
    } else if (requestedDirectoryEntry.type) {
      throw new Error(`not a directory: ${requestedPath}`);
    } else {
      setCurrentPath(requestedPathArr);
    }
  };

  const listWorkingDirectory = () => {
    const currentDirectoryRecord = Ramda.path(
      currentPath,
      currentFileSystemDirectory
    );

    if (!currentDirectoryRecord) {
      return [];
    }

    return Object.keys(currentDirectoryRecord);
  };

  return {
    goBack,
    goTo,
    listWorkingDirectory,
    currentPath,
  };
}

const isNotEmpty = Ramda.compose(Ramda.not, Ramda.isEmpty);
