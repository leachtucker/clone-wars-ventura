import React from 'react';
import styled from 'styled-components';

import { Rnd } from 'react-rnd';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { IoMdRefresh } from 'react-icons/io';
import { AppWrapper } from '../AppWrapper';
import Button from '../../Button';
import { AiFillGithub, AiOutlineGoogle } from 'react-icons/ai';

type ChromeProps = { isFocused: boolean };

function Chrome(props: ChromeProps) {
  const [currentUrl, setCurrentUrl] = React.useState('https://www.google.com/');

  return (
    <AppWrapper isFocused={props.isFocused}>
      <TopBar />
      <UrlBarContainer>
        <NavigationButtonsContainer>
          <Button style={{ fontSize: '2.2rem' }}>
            <BiLeftArrowAlt />
          </Button>

          <Button style={{ fontSize: '2.2rem' }}>
            <BiRightArrowAlt />
          </Button>

          <Button style={{ fontSize: '2rem' }}>
            <IoMdRefresh />
          </Button>
        </NavigationButtonsContainer>

        <UrlBar value={currentUrl} />
      </UrlBarContainer>
      <BookmarksBarContainer>
        <BookmarkButton
          onClick={() => setCurrentUrl('https://www.google.com/')}
        >
          <AiOutlineGoogle />
          Google
        </BookmarkButton>

        <BookmarkButton
          onClick={() => setCurrentUrl('https://github.com/leachtucker')}
        >
          <AiFillGithub />
          GitHub
        </BookmarkButton>

        <BookmarkButton
          onClick={() =>
            setCurrentUrl('https://github.com/leachtucker/clone-wars-ventura')
          }
        >
          <AiFillGithub />
          OS Clone
        </BookmarkButton>
      </BookmarksBarContainer>
      <PageContainer>
        <iframe src={currentUrl} style={{ height: '100%', width: '100%' }} />
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
