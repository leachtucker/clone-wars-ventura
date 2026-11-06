import React from 'react';
import styled from 'styled-components';
import * as Ramda from 'ramda';

import { BiLeftArrowAlt, BiRightArrowAlt, BiLinkExternal } from 'react-icons/bi';
import { IoMdRefresh } from 'react-icons/io';
import { AppWrapper } from '../AppWrapper';
import Button from '../../primitives/Button';
import { AiFillGithub, AiOutlineGoogle, AiFillBook } from 'react-icons/ai';
import { RiNetflixFill } from 'react-icons/ri';

type ChromeProps = { isFocused: boolean };

function Chrome(props: ChromeProps) {
  const navigation = useNavigationState();
  const [iframeKey, setIframeKey] = React.useState(() => Math.random());
  const [addressValue, setAddressValue] = React.useState('');

  const { currentState } = navigation;
  const displayUrl =
    currentState.url === HOME_URL
      ? ''
      : currentState.displayUrl ?? currentState.url;
  const isHome = currentState.url === HOME_URL;
  const blockedHost = isHome ? null : getBlockedHost(currentState.url);

  React.useEffect(() => {
    setAddressValue(displayUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState.url]);

  const handleRefreshClick = () => {
    setIframeKey(Math.random());
  };

  const handleAddressSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (addressValue.trim().length > 0) {
      navigation.goTo(navigationStateFromInput(addressValue));
    }
  };

  const handleOpenExternal = () => {
    if (!isHome) {
      window.open(displayUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const createHandleBookmarkClick = (bookmark: Bookmark) => {
    return () =>
      navigation.goTo({
        url: bookmark.url,
        displayUrl: bookmark.displayUrl,
        pageTitle: bookmark.title,
      });
  };

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <ActiveTab>{currentState.pageTitle}</ActiveTab>
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

          <NavButton
            style={{ fontSize: '1.7rem', marginLeft: '0.3rem' }}
            onClick={handleOpenExternal}
            disabled={isHome}
            title="Open in a real browser tab"
          >
            <BiLinkExternal />
          </NavButton>
        </NavigationButtonsContainer>

        <form onSubmit={handleAddressSubmit} style={{ flex: 1 }}>
          <UrlBar
            value={addressValue}
            onChange={(event) => setAddressValue(event.target.value)}
            placeholder="Search Google or type a URL"
            spellCheck={false}
          />
        </form>
      </UrlBarContainer>
      <BookmarksBarContainer>
        {BOOKMARKS.map((bookmark) => (
          <BookmarkButton
            key={bookmark.title}
            onClick={createHandleBookmarkClick(bookmark)}
          >
            {bookmark.icon}
            {bookmark.title}
          </BookmarkButton>
        ))}
      </BookmarksBarContainer>

      <PageContainer>
        {isHome ? (
          <HomePage
            onSearch={(query) =>
              navigation.goTo(navigationStateFromInput(query))
            }
            onBookmark={(bookmark) =>
              createHandleBookmarkClick(bookmark)()
            }
          />
        ) : blockedHost ? (
          <BlockedPage
            key={iframeKey}
            host={blockedHost}
            url={displayUrl}
            onOpenExternal={handleOpenExternal}
            onGoHome={() => navigation.goTo(HOME_NAV)}
          />
        ) : (
          <iframe
            key={iframeKey}
            src={currentState.url}
            title={currentState.pageTitle}
            style={{ height: '100%', width: '100%', border: 'none' }}
          />
        )}
      </PageContainer>
    </AppWrapper>
  );
}

export default Chrome;

/* ------------------------------------------------------------------ */
/*  Pages                                                              */
/* ------------------------------------------------------------------ */

function HomePage(props: {
  onSearch: (query: string) => void;
  onBookmark: (bookmark: Bookmark) => void;
}) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length > 0) {
      props.onSearch(query);
    }
  };

  return (
    <ScrollablePage>
      <HomeContent>
        <HomeTitle>New Tab</HomeTitle>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <HomeSearchInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Google or type a URL"
            spellCheck={false}
            autoFocus
          />
        </form>

        <TileGrid>
          {BOOKMARKS.map((bookmark) => (
            <TileButton
              key={bookmark.title}
              onClick={() => props.onBookmark(bookmark)}
            >
              <TileIcon>{bookmark.icon}</TileIcon>
              <TileLabel>{bookmark.title}</TileLabel>
              <TileHost>
                {getHost(bookmark.displayUrl ?? bookmark.url)}
              </TileHost>
            </TileButton>
          ))}
        </TileGrid>

        <HomeNote>
          Some sites (GitHub, Netflix, and most sign-in pages) forbid being
          shown inside another page, so they open in a real browser tab
          instead of loading here.
        </HomeNote>
      </HomeContent>
    </ScrollablePage>
  );
}

function BlockedPage(props: {
  host: string;
  url: string;
  onOpenExternal: () => void;
  onGoHome: () => void;
}) {
  return (
    <ScrollablePage>
      <BlockedContent>
        <BlockedTitle>{props.host} refused to connect</BlockedTitle>
        <BlockedBody>
          This site tells browsers not to display it inside another page
          (via its <code>X-Frame-Options</code> /{' '}
          <code>frame-ancestors</code> headers). That block comes from{' '}
          {props.host} itself, so no embedded browser can load it — but it
          works fine in a real tab.
          {props.host.includes('netflix') &&
            ' Netflix also needs a signed-in, DRM-enabled real browser for playback.'}
        </BlockedBody>
        <BlockedActions>
          <PrimaryButton onClick={props.onOpenExternal}>
            <BiLinkExternal style={{ fontSize: '1.7rem' }} />
            Open {props.host} in a new tab
          </PrimaryButton>
          <SecondaryButton onClick={props.onGoHome}>
            Back to home
          </SecondaryButton>
        </BlockedActions>
      </BlockedContent>
    </ScrollablePage>
  );
}

/* ------------------------------------------------------------------ */
/*  Bookmarks & navigation helpers                                     */
/* ------------------------------------------------------------------ */

type Bookmark = {
  title: string;
  /** URL actually loaded in the iframe. */
  url: string;
  /** URL shown in the address bar / opened externally, when different. */
  displayUrl?: string;
  icon: React.ReactNode;
};

const BOOKMARKS: Bookmark[] = [
  {
    title: 'Google',
    // google.com sends X-Frame-Options: SAMEORIGIN, but the igu=1 search
    // view is served without that header specifically so it can be framed.
    url: 'https://www.google.com/search?igu=1',
    displayUrl: 'https://www.google.com/',
    icon: <AiOutlineGoogle />,
  },
  {
    title: 'Netflix',
    url: 'https://www.netflix.com/',
    icon: <RiNetflixFill style={{ fontSize: '1.5rem' }} />,
  },
  {
    title: 'GitHub',
    url: 'https://github.com/leachtucker',
    icon: <AiFillGithub />,
  },
  {
    title: 'OS Clone',
    url: 'https://github.com/leachtucker/clone-wars-ventura',
    icon: <AiFillGithub />,
  },
  {
    title: 'Resume',
    url: 'https://resume.tuckerleach.com',
    icon: <AiFillBook style={{ fontSize: '1.6rem' }} />,
  },
];

/**
 * Hosts that are known to forbid framing via X-Frame-Options: DENY or a
 * Content-Security-Policy frame-ancestors directive. Verified against the
 * live response headers of each site — an <iframe> pointed at any of them
 * renders the browser's "refused to connect" error page.
 */
const BLOCKED_HOSTS = new Set([
  'github.com',
  'gist.github.com',
  'netflix.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'amazon.com',
  'youtube.com',
  'm.youtube.com',
  'linkedin.com',
  'twitch.tv',
]);

function getHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return url;
  }
}

/**
 * Returns the host if this URL is known to refuse being framed, else null.
 * Google is special-cased: only its igu=1 search view may be framed.
 */
function getBlockedHost(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (error) {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

  if (host === 'google.com') {
    return parsed.searchParams.get('igu') === '1' ? null : host;
  }

  return BLOCKED_HOSTS.has(host) ? host : null;
}

function googleSearchState(query: string): NavState {
  const encoded = encodeURIComponent(query);
  return {
    // igu=1 = the frameable Google Search view (no X-Frame-Options header).
    url: `https://www.google.com/search?igu=1&q=${encoded}`,
    displayUrl: `https://www.google.com/search?q=${encoded}`,
    pageTitle: query,
  };
}

/** Turns raw address-bar text into a navigation target. */
function navigationStateFromInput(rawInput: string): NavState {
  const input = rawInput.trim();

  const looksLikeUrl =
    /^https?:\/\//i.test(input) ||
    (!/\s/.test(input) && /\.[a-z]{2,}/i.test(input));

  if (!looksLikeUrl) {
    return googleSearchState(input);
  }

  const url = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  return { url, pageTitle: getHost(url).replace(/^www\./, '') || url };
}

/* ------------------------------------------------------------------ */
/*  Styled components                                                  */
/* ------------------------------------------------------------------ */

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

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

  background-color: ${({ theme }) =>
    theme.colors.chromeTopBarTabBackground};
`;

const ScrollablePage = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;

  color: ${({ theme }) => theme.colors.primary};
`;

const HomeContent = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 4rem 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
`;

const HomeTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 600;
`;

const HomeSearchInput = styled.input`
  width: 100%;
  height: 3.6rem;

  padding: 0 1.8rem;
  border-radius: 999px;
  font-size: 1.4rem;

  background-color: ${({ theme }) => theme.colors.chromeTopBarBackground};
  color: ${({ theme }) => theme.colors.primary};

  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.transparentGrey};
`;

const TileGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
`;

const TileButton = styled.button`
  width: 10rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  padding: 1.4rem 0.6rem;
  border: none;
  border-radius: 12px;
  background: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.transparentGrey};
  }
`;

const TileIcon = styled.span`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.chromeTopBarBackground};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2.4rem;
`;

const TileLabel = styled.span`
  font-size: 1.3rem;
`;

const TileHost = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.grey};

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HomeNote = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey};
  max-width: 44rem;
`;

const BlockedContent = styled.div`
  max-width: 52rem;
  margin: 0 auto;
  padding: 5rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const BlockedTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
`;

const BlockedBody = styled.p`
  font-size: 1.35rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.secondary};

  & > code {
    font-family: monospace;
    font-size: 1.2rem;
  }
`;

const BlockedActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  padding: 0.9rem 1.6rem;
  border: none;
  border-radius: 999px;

  background-color: ${({ theme }) => theme.colors.highlightBlue};
  color: white;
  font-size: 1.3rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryButton = styled.button`
  padding: 0.9rem 1.6rem;
  border: 1px solid ${({ theme }) => theme.colors.transparentGrey};
  border-radius: 999px;

  background: none;
  color: inherit;
  font-size: 1.3rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.transparentGrey};
  }
`;

/* ------------------------------------------------------------------ */
/*  Navigation state                                                   */
/* ------------------------------------------------------------------ */

type NavState = { url: string; displayUrl?: string; pageTitle: string };

const HOME_URL = 'clonewars://home';
const HOME_NAV: NavState = { url: HOME_URL, pageTitle: 'New Tab' };
const INITIAL_NAV = HOME_NAV;

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
    // Truncate any forward history before appending, like a real browser.
    const nextHistory = [
      ...history.slice(0, currentHistoryIdx + 1),
      nextNav,
    ];
    setHistory(nextHistory);
    setCurrentHistoryIdx(nextHistory.length - 1);
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
