import React from 'react';

/**
 * True when the viewport is phone-sized. The OS switches to its mobile
 * layout (full-screen apps, tap-to-open icons) at or below this width,
 * which covers all iPhones in portrait.
 */
export const MOBILE_BREAKPOINT_PX = 768;

export function useIsMobile(): boolean {
  const query = `(max-width: ${MOBILE_BREAKPOINT_PX}px)`;
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => window.matchMedia(query).matches
  );

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = () => setIsMobile(mediaQueryList.matches);
    handleChange();
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [query]);

  return isMobile;
}

export default useIsMobile;
