import styled, { css } from 'styled-components';

export const AppWrapper = styled.div<{ isFocused: boolean }>`
  height: 100%;
  overflow: hidden;

  backdrop-filter: blur(65px);
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: inherit;

  cursor: default;

  ${(props) =>
    props.isFocused &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundTransparent};
    `}
`;
