import React from 'react';
import { RndDragCallback } from 'react-rnd';

import DesktopIcon, {
  type IconButtonComponent,
  type IconConfig,
} from './DesktopIcon';

type DesktopIconListProps = {
  resetIconPositions: boolean;
  onIconDoubleClick?: (iconKey: string) => void;
  icons: IconConfig[];
  IconButtonComponent?: IconButtonComponent;
};

function DesktopIconList(props: DesktopIconListProps) {
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>(null);

  const resetSelectedIcon = () => setSelectedIcon(null);

  function createIconDoubleClickHandler(iconKey: string) {
    return function handleIconDoubleClick(e: React.MouseEvent) {
      e.stopPropagation();
      props.onIconDoubleClick?.(iconKey);
    };
  }

  function createDragStartHandler(iconKey: string) {
    const handleDragStart: RndDragCallback = (e) => {
      e.stopPropagation();
      setSelectedIcon(iconKey);
    };

    return handleDragStart;
  }

  React.useEffect(resetSelectedIcon, [props.resetIconPositions]);

  return (
    <div style={{ width: '100%', height: '99%' }} onClick={resetSelectedIcon}>
      {props.icons.map((iconConfig) => (
        <DesktopIcon
          key={iconConfig.key}
          icon={iconConfig}
          isSelected={iconConfig.key == selectedIcon}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={createIconDoubleClickHandler(iconConfig.key)}
          onDragStart={createDragStartHandler(iconConfig.key)}
          resetPosition={props.resetIconPositions}
          IconButtonComponent={props.IconButtonComponent}
        />
      ))}
    </div>
  );
}

export default DesktopIconList;
