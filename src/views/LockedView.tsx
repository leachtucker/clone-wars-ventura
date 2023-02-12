import styled from 'styled-components';

import { FiArrowRightCircle, FiXCircle } from 'react-icons/fi';
import { Button } from '../components/Button';

import avatar from '../assets/avatar.png';

function LockedView() {
  return (
    <Container>
      <Avatar src={avatar} />
      <Username>Tucker</Username>
      <PasswordInputWrapper>
        <PasswordInput placeholder="Enter Password" />
        <PasswordInputArrow />
      </PasswordInputWrapper>

      <ActionsContainer>
        <ActionWrapper>
          <RoundIconButton style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            <FiXCircle />
          </RoundIconButton>
          <span>Cancel</span>
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

  color: white;
`;

const Avatar = styled.img`
  width: 15rem;
  height: 15rem;
  border-radius: 50%;

  background-color: #f7d4b0;
  box-shadow: 0 0 4px rgb(0 0 0 / 50%);
`;

const Username = styled.span`
  display: block;
  text-align: center;
  font-weight: 600;
  font-size: 2rem;

  margin-top: 24px;
  color: white;

  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.75);
`;

const PasswordInput = styled.input.attrs({
  type: 'password',
})`
  border-radius: 24px;
  padding-left: 15px;
  background-color: rgba(255, 255, 255, 0.35);
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
    color: rgba(255, 255, 255, 0.7);
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  color: inherit;

  margin-top: 12px;
`;

const PasswordInputArrow = styled(FiArrowRightCircle)`
  position: absolute;
  right: 2px;
  top: 3px;

  font-size: 2.4rem;
  stroke-width: 1.5px;
`;

const ActionsContainer = styled.div`
  position: fixed;
  bottom: 5%;
`;

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const RoundIconButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.35);

  font-size: 2rem;
  color: white;

  border-radius: 50%;

  display: flex;
  padding: 0.4rem;
`;
