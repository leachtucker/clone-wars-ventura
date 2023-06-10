import React from 'react';
import { Rnd } from 'react-rnd';
import { IconButton } from '../views/UnlockedView';
import { ApplicationName } from './apps';

type DesktopIconProps = {
  icon: IconConfig;
  parent: HTMLDivElement;
  isSelected: boolean;
  appName: ApplicationName;
  resetPositions: number;
  onClick: (e: React.MouseEvent) => void;
};

function DesktopIcon(props: DesktopIconProps) {
  const ref = React.useRef<Rnd>();

  React.useEffect(() => {
    ref.current?.updatePosition(props.icon.position);
  }, [props.resetPositions]);

  return (
    <Rnd
      ref={(c) => (ref.current = c as Rnd)}
      bounds={props.parent}
      enableResizing={false}
      enableUserSelectHack
      default={{
        ...props.icon.position,
        width: 'auto',
        height: 'auto',
      }}
      // dragGrid={[20, 20]}
      on
    >
      <IconButton
        aria-label={props.icon.iconName}
        onClick={props.onClick}
        isSelected={props.isSelected}
      >
        <img
          src={props.icon.imageSrc}
          style={{ height: '100%', borderRadius: '8px' }}
          draggable={false}
        />
      </IconButton>
    </Rnd>
  );
}

export default DesktopIcon;

export type IconConfig = {
  iconName: string;
  imageSrc: string;
  position: { x: number; y: number };
};
