import React from 'react';
import styled, { css } from 'styled-components';
import { useActor, useSelector } from '@xstate/react';

import Avatar from '../components/primitives/Avatar';
import RoundIconButton from '../components/primitives/RoundIconButton';
import { Show } from '../components/primitives/Show';
import { shake } from '../shared/keyframes';
import { FiArrowRightCircle, FiXCircle } from 'react-icons/fi';
import avatar from '../assets/avatar.png';

import { useGlobalServices } from '../shared/providers/GlobalServicesProvider';
import { loginServiceSelector } from '../machines/desktop.machine';
import themes from '../shared/config/themes';

function LockedView() {
  const { desktopService } = useGlobalServices();
  const loginService = useSelector(desktopService, loginServiceSelector);

  const [state, send] = useActor(loginService);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send('submit');
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    send({ type: 'PASSWORD.CHANGE', payload: e.target.value });
  }

  const isPasswordInput = state.context.password.length > 0;
  return (
    <Container>
      <Avatar src={avatar} style={{ width: '15rem', height: '15rem' }} />
      <Username>Tucker</Username>

      <form onSubmit={handleSubmit}>
        <PasswordInputWrapper>
          <PasswordInput
            value={state.context.password}
            onChange={handlePasswordChange}
            autoFocus
            $invalid={state.matches('invalid')}
          />

          <Show when={isPasswordInput && state.matches('idle')}>
            <PasswordInputArrow />
          </Show>
        </PasswordInputWrapper>
      </form>
      <PasswordHint>Hint: root</PasswordHint>

      <ActionsContainer>
        <ActionWrapper>
          <RoundIconButton>
            <FiXCircle />
          </RoundIconButton>
          <ActionLabel>Cancel</ActionLabel>
        </ActionWrapper>
      </ActionsContainer>
    </Container>
  );
}

export default LockedView;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;

  color: ${themes.dark.colors.primary};
`;

const Username = styled.span`
  display: block;
  margin-top: 2.4rem;

  text-align: center;
  font-weight: 600;
  font-size: 2rem;

  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.75);
`;

const PasswordInput = styled.input.attrs({
  type: 'password',
  placeholder: 'Enter Password',
})`
  border-radius: 24px;
  padding-left: 1.5rem;
  background-color: ${themes.light.colors.backgroundTransparent};
  border: none;

  display: block;
  width: 16rem;
  height: 3rem;

  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.18);

  color: inherit;
  caret-color: inherit;

  letter-spacing: 0.6px;

  &:not(:placeholder-shown) {
    font-size: 2rem;
    letter-spacing: 0.2rem;
    font-weight: bold;
  }

  &:focus-visible {
    outline: none;
  }

  &::placeholder {
    color: ${themes.dark.colors.primary};
    opacity: 0.7;
  }

  animation: ${(props: { $invalid?: boolean }) =>
    props.$invalid
      ? css`
          ${shake} 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
        `
      : 'initial'};
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  color: inherit;

  margin-top: 12px;
`;

const PasswordInputArrow = styled(FiArrowRightCircle)`
  position: absolute;
  right: 0.2rem;
  top: 3px;

  font-size: 2.4rem;
  stroke-width: 1.5px;
  opacity: 0.6;
`;

const PasswordHint = styled.span`
  margin-top: 8px;
`;

const ActionsContainer = styled.div`
  position: fixed;
  bottom: 5%;
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`;

const ActionLabel = styled.span`
  font-size: 1.2rem;
`;
