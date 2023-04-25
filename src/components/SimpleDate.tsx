import styled from 'styled-components';

type SimpleDateProps = { date: Date };
function SimpleDate({ date }: SimpleDateProps) {
  return (
    <DateWrapper>
      {WeekDayIntlDateTimeFormat.format(date)} {IntlDateTimeFormat.format(date)}
    </DateWrapper>
  );
}

export default SimpleDate;

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
