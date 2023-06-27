import React from 'react';
import { useSelector } from '@xstate/react';
import Color from 'color';
import styled, { css } from 'styled-components';

import { AppWrapper } from '../AppWrapper';
import { useGlobalServices } from '../../../shared/providers/GlobalServicesProvider';
import { fileSystemSelector } from '../../../machines/desktop.machine';
import { Directory } from '../../../shared/file-system';

import { VscFolder } from 'react-icons/vsc';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import RoundIconButton from '../../primitives/RoundIconButton';

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

  const handleBackArrowClick = () => {
    // @ts-expect-error testing
    setActivePath((prevPath) => prevPath?.slice(0, -1));
  };

  return (
    <AppWrapper isFocused={props.isFocused} style={{ display: 'flex' }}>
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
              <CapitalizeText>{dirEntryName}</CapitalizeText>
            </SideBarCategoryItem>
          ))}
        </SideBarCategoryList>
      </SideBarContainer>

      <ActiveDirectoryContainer>
        <ActiveDirectoryTopBar>
          <NavigationArrowsContainer>
            <IconButton onClick={handleBackArrowClick}>
              <IoIosArrowBack />
            </IconButton>

            <IconButton>
              <IoIosArrowForward />
            </IconButton>
          </NavigationArrowsContainer>
          <ActiveDirectoryHeader>{activePath?.at(-1)}</ActiveDirectoryHeader>
        </ActiveDirectoryTopBar>
        <ActiveDirectoryEntriesContainer />
      </ActiveDirectoryContainer>
    </AppWrapper>
  );
}

export default Finder;

const SideBarContainer = styled.div`
  height: 100%;
  width: 16rem;

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

const ActiveDirectoryContainer = styled.div`
  width: calc(100% - 16rem);
  height: 100%;
`;

const ActiveDirectoryTopBar = styled.div`
  height: 5.5rem;
  background-color: ${({ theme }) => theme.colors.finderTopBarBackground};

  display: flex;
  align-items: center;

  padding: 1rem 2rem;
`;

const ActiveDirectoryEntriesContainer = styled.div`
  height: calc(100% - 5.5rem);
  background-color: ${({ theme }) => theme.colors.finderBackground};
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.2);
`;

const CapitalizeText = styled.span`
  text-transform: capitalize;
`;

const ActiveDirectoryHeader = styled(CapitalizeText)`
  font-size: 1.3rem;
  font-weight: 500;
  -webkit-text-stroke-width: 0.3px;

  color: ${({ theme }) => theme.colors.secondary};
`;

const NavigationArrowsContainer = styled.div`
  font-size: 2.1rem;
  display: flex;
  align-items: center;

  margin-right: 1.5rem;
`;

const IconButton = styled(RoundIconButton)`
  padding: 0.25rem 0.6rem;
  border-radius: 5px;

  color: grey;

  :hover {
    background-color: ${({ theme }) => theme.colors.finderSideBarSelection};
  }
`;
