import styled from 'styled-components';
import Button from '../primitives/Button';

export const DockIconButton = styled(Button)`
  display: block;
  padding: 0;
  height: 100%;

  & > img {
    height: 100%;
    width: auto;
  }

  &:active {
    filter: brightness(80%);
    transform: scale3d(0.97, 0.97, 1);
  }
`;
