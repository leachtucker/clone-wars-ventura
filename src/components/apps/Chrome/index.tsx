import React from 'react';
import styled from 'styled-components';
import * as Ramda from 'ramda';

import { Rnd } from 'react-rnd';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { IoMdRefresh } from 'react-icons/io';
import { AppWrapper } from '../AppWrapper';
import Button from '../../Button';
import { AiFillGithub, AiOutlineGoogle } from 'react-icons/ai';
import { RiNetflixFill } from 'react-icons/ri';

type ChromeProps = { isFocused: boolean };

function Chrome(props: ChromeProps) {
  const navigation = useNavigationState();
  const [iframeKey, setIframeKey] = React.useState(() => Math.random());

  const handleRefreshClick = () => {
    setIframeKey(Math.random());
  };

  const createHandleBookmarkClick = (bookmarkUrl: string) => {
    return () => navigation.goTo(bookmarkUrl);
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <UrlBarContainer>
        <NavigationButtonsContainer>
          <NavButton
            style={{ fontSize: '2.2rem' }}
            onClick={navigation.goBackward}
          >
            <BiLeftArrowAlt />
          </NavButton>

          <NavButton
            style={{ fontSize: '2.2rem' }}
            onClick={navigation.goForward}
          >
            <BiRightArrowAlt />
          </NavButton>

          <NavButton style={{ fontSize: '2rem' }} onClick={handleRefreshClick}>
            <IoMdRefresh />
          </NavButton>
        </NavigationButtonsContainer>

        <UrlBar value={navigation.state.currentUrl} readOnly />
      </UrlBarContainer>
      <BookmarksBarContainer>
        <BookmarkButton
          onClick={createHandleBookmarkClick('https://www.google.com/')}
        >
          <AiOutlineGoogle />
          Google
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick('https://www.netflix.com/')}
        >
          <RiNetflixFill style={{ fontSize: '1.5rem' }} />
          Netflix
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick('https://github.com/leachtucker')}
        >
          <AiFillGithub />
          GitHub
        </BookmarkButton>

        <BookmarkButton
          onClick={createHandleBookmarkClick(
            'https://github.com/leachtucker/clone-wars-ventura'
          )}
        >
          <AiFillGithub />
          OS Clone
        </BookmarkButton>
      </BookmarksBarContainer>

      <PageContainer>
        <iframe
          key={iframeKey}
          src={navigation.state.currentUrl}
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
  cursor: pointer;
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
  height: 100%;
  width: 100%;

  background-color: white;
`;

type NavigationState = {
  currentUrl: string;
  backwardUrlsStack: string[];
  forwardUrlsStack: string[];
};

function useNavigationState() {
  const [state, setState] = React.useState<NavigationState>({
    currentUrl: 'https://www.google.com/',
    backwardUrlsStack: [],
    forwardUrlsStack: [],
  });

  const goBackward = () => {
    setState((prevNav) => {
      if (prevNav.backwardUrlsStack.length > 0) {
        const nextUrl = Ramda.last(prevNav.backwardUrlsStack) as string;
        const backwardUrlsStack = Ramda.init(prevNav.backwardUrlsStack);

        return {
          currentUrl: nextUrl,
          backwardUrlsStack,
          forwardUrlsStack: [...prevNav.forwardUrlsStack, prevNav.currentUrl],
        };
      }

      return prevNav;
    });
  };

  const goForward = () => {
    setState((prevNav) => {
      if (prevNav.forwardUrlsStack.length > 0) {
        const nextUrl = Ramda.last(prevNav.forwardUrlsStack) as string;
        const forwardUrlsStack = Ramda.init(prevNav.forwardUrlsStack);

        return {
          currentUrl: nextUrl,
          backwardUrlsStack: [...prevNav.backwardUrlsStack, prevNav.currentUrl],
          forwardUrlsStack,
        };
      }

      return prevNav;
    });
  };

  const goTo = (nextUrl: string) => {
    setState((prevNav) => ({
      ...prevNav,
      currentUrl: nextUrl,
      backwardUrlsStack: [...prevNav.backwardUrlsStack, prevNav.currentUrl],
    }));
  };

  return {
    state,
    goTo,
    goForward,
    goBackward,
  };
}
