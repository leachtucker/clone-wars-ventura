import React from 'react';
import styled from 'styled-components';
import { Rnd } from 'react-rnd';

import { AppWrapper } from './AppWrapper';
import avatarImg from '../../assets/avatar.png';
import Avatar from '../Avatar';

import {
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillLinkedin,
} from 'react-icons/ai';

type AboutThisEngineerProps = { isFocused: boolean };

function AboutThisEngineer(props: AboutThisEngineerProps) {
  return (
    <AppWrapper isFocused={props.isFocused}>
      <Container>
        <Avatar
          src={avatarImg}
          style={{ width: '15rem', marginTop: '4.5rem' }}
        />

        <span
          style={{
            fontWeight: 700,
            fontSize: '2.3rem',
            marginTop: '3rem',
          }}
        >
          Tucker Leach
        </span>
        <span style={{ marginTop: '0.5rem' }}>Software Engineer</span>

        <SocialsContainer>
          <SocialLink href="https://github.com/leachtucker">
            <AiFillGithub style={{ pointerEvents: 'none' }} />
          </SocialLink>

          <SocialLink href="https://twitter.com/BuiltByTucker">
            <AiFillTwitterCircle />
          </SocialLink>

          <SocialLink href="https://www.linkedin.com/in/leachtucker/">
            <AiFillLinkedin />
          </SocialLink>
        </SocialsContainer>
      </Container>
    </AppWrapper>
  );
}

export default AboutThisEngineer;

export const AboutThisEngineer_RND_CONFIG = {
  default: {
    width: 280,
    height: 350,
    x: 250,
    y: 200,
  },
  enableResizing: false,
} satisfies Partial<React.ComponentProps<typeof Rnd>>;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.colors.primary};
`;

const SocialsContainer = styled.div`
  display: flex;

  margin: 0 auto;
  margin-top: 2rem;

  width: fit-content;
  gap: 0 1rem;
`;

const SocialLink = styled.a.attrs({ target: '_blank' })`
  all: unset;
  font-size: 4rem;
  cursor: pointer;
  -webkit-user-drag: none;
`;
