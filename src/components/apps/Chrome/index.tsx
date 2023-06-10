import React from 'react';
import styled from 'styled-components';
import * as Ramda from 'ramda';

import { Rnd } from 'react-rnd';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { IoMdRefresh } from 'react-icons/io';
import { AppWrapper } from '../AppWrapper';
import Button from '../../primitives/Button';
import { AiFillGithub, AiOutlineGoogle } from 'react-icons/ai';
import { RiNetflixFill } from 'react-icons/ri';

type ChromeProps = { isFocused: boolean };

function Chrome(props: ChromeProps) {
  const navigation = useNavigationState();
  const [iframeKey, setIframeKey] = React.useState(() => Math.random());

  const handleRefreshClick = () => {
    setIframeKey(Math.random());
  };

  const createHandleBookmarkClick = (
    bookmarkUrl: string,
    bookmarkTitle: string
  ) => {
    return () =>
      navigation.goTo({ url: bookmarkUrl, pageTitle: bookmarkTitle });
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <ActiveTab>{navigation.currentState.pageTitle}</ActiveTab>
      <UrlBarContainer>
        <NavigationButtonsContainer>
          <NavButton
            style={{ fontSize: '2.2rem' }}
            onClick={navigation.goBackward}
            disabled={!navigation.canGoBackward}
          >
            <BiLeftArrowAlt />
          </NavButton>

          <NavButton
            style={{ fontSize: '2.2rem' }}
            onClick={navigation.goForward}
            disabled={!navigation.canGoForward}
          >
            <BiRightArrowAlt />
          </NavButton>

          <NavButton
            style={{ fontSize: '2rem', marginLeft: '0.3rem' }}
            onClick={handleRefreshClick}
          >
            <IoMdRefresh style={{ transform: 'translateY(1px)' }} />
          </NavButton>
        </NavigationButtonsContainer>

        <UrlBar value={navigation.currentState.url} readOnly />
      </UrlBarContainer>
      <BookmarksBarContainer>
        <BookmarkButton
          onClick={createHandleBookmarkClick(
            'https://www.google.com/',
            'Google'
          )}
        >
          <AiOutlineGoogle />
          Google
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick(
            'https://www.netflix.com/',
            'Netflix'
          )}
        >
          <RiNetflixFill style={{ fontSize: '1.5rem' }} />
          Netflix
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick(
            'https://github.com/leachtucker',
            'GitHub'
          )}
        >
          <AiFillGithub />
          GitHub
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick(
            'https://github.com/leachtucker/clone-wars-ventura',
            'OS Clone'
          )}
        >
          <AiFillGithub />
          OS Clone
        </BookmarkButton>
      </BookmarksBarContainer>

      <PageContainer>
        <iframe
          key={iframeKey}
          src={navigation.currentState.url}
          style={{ height: '100%', width: '100%' }}
        />
      </PageContainer>
    </AppWrapper>
  );
}

export default Chrome;

export const Chrome_RND_CONFIG = {
  minHeight: 400,
  minWidth: 400,
  default: {
    width: 700,
    height: 700,
    x: 100,
    y: 100,
  },
  enableResizing: true,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const TopBar = styled.div`
  height: 4rem;
  background-color: ${({ theme }) => theme.colors.chromeTopBarBackground};
  color: ${({ theme }) => theme.colors.primary};

  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
`;

const ActiveTab = styled.div`
  position: absolute;
  transform: translate3d(75px, -34px, 0px);

  width: 16rem;
  height: 34px;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  background-color: ${({ theme }) => theme.colors.chromeTopBarTabBackground};
  color: ${({ theme }) => theme.colors.primary};

  display: flex;
  align-items: center;
  padding: 0 1rem;

  font-size: 1.2rem;
`;

const UrlBarContainer = styled.div`
  height: 3rem;

  background-color: ${({ theme }) => theme.colors.chromeTopBarTabBackground};
  color: ${({ theme }) => theme.colors.primary};

  display: flex;
  align-items: center;

  padding-right: 1.2rem;
`;

const NavigationButtonsContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
`;

const NavButton = styled(Button)`
  display: block;
  padding: 0;
  height: 22px;

  cursor: pointer;

  &:disabled {
    cursor: default;
    color: ${({ theme }) => theme.colors.grey};
  }
`;

const UrlBar = styled.input`
  background-color: ${({ theme }) => theme.colors.chromeTopBarBackground};
  color: ${({ theme }) => theme.colors.secondary};

  width: 100%;
  height: 2rem;

  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-size: 1.2rem;

  outline: none;
  border: none;
  pointer-events: none;
`;

const BookmarksBarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.chromeTopBarTabBackground};
  color: ${({ theme }) => theme.colors.secondary};

  border-bottom: 1px solid ${({ theme }) => theme.colors.transparentGrey};

  height: 3rem;
  padding: 0 0.3rem;

  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const BookmarkButton = styled(Button)`
  display: flex;
  align-items: center;

  max-width: 10rem;
  gap: 0.4rem;

  padding: 4px 6px;
  border-radius: 12px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 1.1rem;
  & > svg {
    font-size: 1.7rem;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.transparentGrey};
    cursor: pointer;
  }
`;

const PageContainer = styled.div`
  height: calc(100% - 10rem);
  width: 100%;

  background-color: white;
`;

type NavState = { url: string; pageTitle: string };

const INITIAL_NAV = { url: 'https://www.google.com/', pageTitle: 'Google' };
function useNavigationState() {
  const [history, setHistory] = React.useState<NavState[]>([INITIAL_NAV]);
  const [currentHistoryIdx, setCurrentHistoryIdx] = React.useState<number>(0);

  const currentState = history[currentHistoryIdx];
  const canGoForward = currentHistoryIdx < Ramda.dec(history.length);
  const canGoBackward = currentHistoryIdx > 0;

  const goBackward = () => {
    if (canGoBackward) {
      setCurrentHistoryIdx(Ramda.dec);
    }
  };

  const goForward = () => {
    if (canGoForward) {
      setCurrentHistoryIdx(Ramda.inc);
    }
  };

  const goTo = (nextNav: NavState) => {
    setHistory((prevHistory) => {
      setCurrentHistoryIdx(() => history.length);
      return [...prevHistory, nextNav];
    });
  };

  return {
    currentState,
    goTo,
    goForward,
    goBackward,
    canGoForward,
    canGoBackward,
  };
}
