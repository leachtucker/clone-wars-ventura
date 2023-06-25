import React from 'react';
import { useSelector } from '@xstate/react';
import { Rnd } from 'react-rnd';
import Color from 'color';
import styled, { css } from 'styled-components';

import { AppWrapper } from '../AppWrapper';
import { getWindowStartingPosition } from '../app-config-mappings';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { fileSystemSelector } from '../../../machines/desktop.machine';
import { Directory } from '../../../shared/file-system';
import { capitalize } from '../../../shared/utils/fp';

import { VscFolder } from 'react-icons/vsc';

type FinderProps = {
  isFocused: boolean;
};

function Finder(props: FinderProps) {
  const { desktopService } = useGlobalServices();
  const fileSystem = useSelector(desktopService, fileSystemSelector);
  const homeDirectory = fileSystem.home as Directory;

  const [activePath, setActivePath] = React.useState<string[] | null>(null);

  const createSideBarItemClickHandler = (itemName: string) => {
    return () => {
      setActivePath([itemName]);
    };
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <SideBarContainer>
        <SideBarCategoryHeader>Favorites</SideBarCategoryHeader>

        <SideBarCategoryList>
          {Object.keys(homeDirectory).map((dirEntryName) => (
            <SideBarCategoryItem
              key={dirEntryName}
              isActive={activePath?.[0] == dirEntryName}
              onClick={createSideBarItemClickHandler(dirEntryName)}
            >
              <SideBarFolderIcon />
              {capitalize(dirEntryName)}
            </SideBarCategoryItem>
          ))}
        </SideBarCategoryList>
      </SideBarContainer>
      Finder
    </AppWrapper>
  );
}

export default Finder;

export const FINDER_RND_CONFIG = {
  minWidth: 500,
  minHeight: 290,
  default: {
    width: 700,
    height: 380,
    ...getWindowStartingPosition(700, 380),
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const SideBarContainer = styled.div`
  height: 100%;
  width: 17rem;

  padding: 0 1.5rem;
  padding-top: 5rem;

  background-color: ${({ theme }) =>
    Color(theme.colors.terminalTopBarBackground).alpha(0.2).toString()};
`;

const SideBarCategoryHeader = styled.h3`
  font-size: 1rem;
  font-weight: bold;

  margin-bottom: 0.5rem;

  color: ${({ theme }) => Color(theme.colors.secondary).alpha(0.5).toString()};
`;

const SideBarCategoryList = styled.ul`
  display: flex;
  flex-direction: column;

  gap: 0.2rem 0;
`;

const SideBarCategoryItem = styled.li<{ isActive?: boolean }>`
  display: flex;
  align-items: center;

  font-size: 1.15rem;

  padding: 0.6rem 1rem;
  border-radius: 5px;

  color: ${({ theme }) => theme.colors.secondary};

  ${(props) =>
    props.isActive &&
    css`
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${props.theme.colors.finderSideBarSelection};
    `}
`;

const SideBarFolderIcon = styled(VscFolder)`
  stroke-width: 0.3px;
  color: rgb(52, 120, 246);

  width: 1.6rem;
  height: auto;

  margin-right: 0.6rem;
`;
