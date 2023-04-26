import styled from 'styled-components';

import Button from './Button';
import themes from '../shared/config/themes';

const RoundIconButton = styled(Button)`
  background-color: ${themes.light.colors.backgroundTransparent};
  color: ${themes.dark.colors.primary};
  opacity: 0.6;

  font-size: 2rem;

  border-radius: 50%;

  display: flex;
  padding: 0.4rem;
`;

export default RoundIconButton;
