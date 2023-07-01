import React from 'react';

function useInitialRender() {
  const initialRender = React.useRef(true);
  React.useLayoutEffect(() => {
    initialRender.current = false;
  });

  return initialRender.current;
}

export default useInitialRender;
