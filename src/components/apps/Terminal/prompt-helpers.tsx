import React from 'react';
import * as Ramda from 'ramda';

import { ActorRefFrom } from 'xstate';

import { DesktopMachine } from '../../../machines/desktop.machine';
import { ApplicationName } from '..';
import { FILE_SYSTEM_DIRECTORY } from '../../../shared/file-system';

export function handleOpenCommand(
  service: ActorRefFrom<DesktopMachine>,
  appName: string
) {
  const validAppNames = ['chrome'];
  if (validAppNames.includes(appName)) {
    service.send({ type: 'WINDOW.OPEN', name: appName as ApplicationName });
  }

  throw Error('App not found');
}

export function usePromptPath() {
  const [currentPath, setCurrentPath] = React.useState<string[]>([]);

  const goBack = () => {
    if (currentPath.length == 1) {
      // Prompt is at top-level dir, do nothing
      return;
    }

    setCurrentPath(Ramda.init);
  };

  const goTo = (requestedPath: string) => {
    if (Ramda.isEmpty(requestedPath)) {
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
      FILE_SYSTEM_DIRECTORY
    );

    if (requestedDirectoryEntry === undefined) {
      throw new Error('No such file or directory');
    } else {
      setCurrentPath(requestedPathArr);
    }
  };

  console.log({ currentPath });

  return {
    goBack,
    goTo,
    currentPath,
  };
}

const isNotEmpty = Ramda.compose(Ramda.not, Ramda.isEmpty);
