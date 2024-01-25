import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const useViewport = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mobile = useMediaQuery({ query: '(max-width: 640px)' });
  useEffect(() => {
    setIsMobile(mobile);
  }, [mobile]);

  const [isTablet, setIsTablet] = useState(false);
  const tablet = useMediaQuery({ query: '(max-width: 768px)' });
  useEffect(() => {
    setIsTablet(tablet);
  }, [tablet]);

  return { isMobile, isTablet };
};
