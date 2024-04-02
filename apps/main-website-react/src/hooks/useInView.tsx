'use client';

import React, { useEffect } from 'react';

const useInView = (ref: React.MutableRefObject<null | HTMLDivElement>) => {
  const [isInView, setIsInView] = React.useState(false);
  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const windowHeight = window.innerHeight;
      const elementTop = ref.current.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        // console.log('element is visible');
        setIsInView(true);
      } else {
        // console.log('element is not');
        setIsInView(false);
      }
    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('load', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('load', onScroll)
    };
  }, [ref]);
  return isInView;
};

export default useInView;
