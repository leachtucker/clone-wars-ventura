import React from 'react';

const UPDATE_INTERVAL_SECONDS = 30;

function useCurrentDate() {
  const [date, setDate] = React.useState(() => new Date());

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, UPDATE_INTERVAL_SECONDS * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return date;
}

export default useCurrentDate;
