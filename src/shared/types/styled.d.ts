import 'styled-components';
import { ThemeMapping } from '../config/themes';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeMapping {}
}
