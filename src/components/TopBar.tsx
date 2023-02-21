import styled from 'styled-components';

import { TiVendorApple } from 'react-icons/ti';

import Button from '../components/Button';
import Toggles from './icons/Toggles';
import themes from '../shared/config/themes';

function TopBar() {
  const now = new Date();
  return (
    <Wrapper>
      <LeftRightContainer>
        <Button style={{ fontSize: '2rem' }}>
          <TiVendorApple />
        </Button>
      </LeftRightContainer>

      <LeftRightContainer>
        <Button style={{ fontSize: '1.4rem' }}>
          <Toggles />
        </Button>
        <DateWrapper>
          {WeekDayIntlDateTimeFormat.format(now)}{' '}
          {IntlDateTimeFormat.format(now)}
        </DateWrapper>
      </LeftRightContainer>
    </Wrapper>
  );
}

export default TopBar;

export const TOPBAR_HEIGHT = '25px';
const Wrapper = styled.div`
  height: ${TOPBAR_HEIGHT};
  width: 100%;

  color: ${themes.dark.colors.primary};
  background-color: ${themes.dark.colors.backgroundTransparent};
  backdrop-filter: blur(65px);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 1.5rem;
`;

const LeftRightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const WeekDayIntlDateTimeFormat = new Intl.DateTimeFormat('default', {
  weekday: 'short',
});
const IntlDateTimeFormat = new Intl.DateTimeFormat('default', {
  month: 'short',
  day: '2-digit',
  hour: 'numeric',
  minute: 'numeric',
});
const DateWrapper = styled.span`
  font-size: 1.2rem;
`;
