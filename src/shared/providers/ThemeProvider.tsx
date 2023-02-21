import React from 'react';

import { ThemeProvider as ThemeProviderBase } from 'styled-components';
import { useGlobalServices } from './GlobalServicesProvider';
import { useSelector } from '@xstate/react';
import { StateFrom } from 'xstate';
import { DesktopMachine } from '../../machines/desktop.machine';
import { getThemeMapping } from '../config/themes';

function ThemeProvider({ children }: React.PropsWithChildren) {
  const { desktopService } = useGlobalServices();

  const themeName = useSelector(desktopService, themeSelector);
  const theme = React.useMemo(() => getThemeMapping(themeName), [themeName]);

  return <ThemeProviderBase theme={theme}>{children}</ThemeProviderBase>;
}

export default ThemeProvider;

function themeSelector(state: StateFrom<DesktopMachine>) {
  return state.context.theme;
}
