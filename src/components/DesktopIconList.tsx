import React from 'react';

import DesktopIcon from './DesktopIcon';
import { ApplicationName, desktopIconsMaps } from './apps';
import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { RndDragCallback } from 'react-rnd';

type DesktopIconListProps = {
  parent: HTMLDivElement;
  resetIconPositions: boolean;
};

function DesktopIconList(props: DesktopIconListProps) {
  const { desktopService } = useGlobalServices();

  const [selectedIcon, setSelectedIcon] =
    React.useState<ApplicationName | null>(null);

  const resetSelectedIcon = () => setSelectedIcon(null);

  function createIconDoubleClickHandler(appName: ApplicationName) {
    return function handleIconDoubleClick(e: React.MouseEvent) {
      e.stopPropagation();
      desktopService.send({ type: 'WINDOW.OPEN', name: appName });
    };
  }

  function createDragStartHandler(appName: ApplicationName) {
    const handleDragStart: RndDragCallback = (e) => {
      e.stopPropagation();
      setSelectedIcon(appName);
    };

    return handleDragStart;
  }

  React.useEffect(resetSelectedIcon, [props.resetIconPositions]);

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={resetSelectedIcon}>
      {Object.entries(desktopIconsMaps).map(([appName, iconConfig]) => (
        <DesktopIcon
          key={appName}
          icon={iconConfig}
          appName={appName as ApplicationName}
          isSelected={appName == selectedIcon}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={createIconDoubleClickHandler(
            appName as ApplicationName
          )}
          parent={props.parent}
          resetPosition={props.resetIconPositions}
          onDragStart={createDragStartHandler(appName as ApplicationName)}
        />
      ))}
    </div>
  );
}

export default DesktopIconList;
