import * as React from 'react';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  const eventListener = (event: MediaQueryListEventMap['change']) => setMatches(event.matches);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.matchMedia(query).addEventListener('change', eventListener);
    }

    return () => {
      window.matchMedia(query).removeEventListener('change', eventListener);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
