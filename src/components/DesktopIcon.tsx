import React, { MouseEventHandler } from 'react';
import { Rnd, RndDragCallback } from 'react-rnd';
import styled, { css } from 'styled-components';
import Color from 'color';

import { ApplicationName } from './apps';
import { DockIconButton } from './Dock';

type DesktopIconProps = {
  icon: IconConfig;
  isSelected: boolean;
  appName: ApplicationName;
  resetPosition: boolean;
  onClick: MouseEventHandler;
  onDoubleClick: MouseEventHandler;
  onDragStart: RndDragCallback;
};

function DesktopIcon(props: DesktopIconProps) {
  const ref = React.useRef<Rnd>();

  React.useEffect(() => {
    ref.current?.updatePosition(props.icon.position);
  }, [props.resetPosition]);

  return (
    <Rnd
      ref={(c) => (ref.current = c as Rnd)}
      bounds="parent"
      enableResizing={false}
      enableUserSelectHack
      default={{
        ...props.icon.position,
        width: 'auto',
        height: 'auto',
      }}
      onDragStart={props.onDragStart}
    >
      <IconWithName
        aria-label={props.icon.iconName}
        onDoubleClick={props.onDoubleClick}
        onClick={props.onClick}
        isSelected={props.isSelected}
      >
        <img
          src={props.icon.imageSrc}
          // style={{ height: '100%', borderRadius: '8px' }}
          draggable={false}
        />
        <span>{props.icon.iconName}</span>
      </IconWithName>
    </Rnd>
  );
}

export default DesktopIcon;

export type IconConfig = {
  iconName: string;
  imageSrc: string;
  position: { x: number; y: number };
};

const IconButton = styled(DockIconButton)<{ isSelected: boolean }>`
  position: relative;
  -webkit-user-drag: none;

  height: 6rem;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: 5px;

  ${(props) =>
    props.isSelected &&
    css`
      border-color: ${props.theme.colors.grey};
      background-color: ${Color(props.theme.colors.grey).alpha(0.3).toString()};
      backdrop-filter: blur(50px);
    `}
`;

const IconWithName = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > span {
    position: absolute;
    top: 105%;

    padding: 2px;
    border-radius: 4px;

    font-weight: 600;
    font-size: 1.2rem;

    color: ${(props) => props.theme.colors.white};
    ${(props) =>
      props.isSelected &&
      css`
        background-color: ${props.theme.colors.blue};
      `}
  }
`;
