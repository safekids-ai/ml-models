'use client';
import React, { useRef } from 'react';
// import useInView from '../../hooks/useInView';
import { useInView } from 'motion/react';

type Props = {
  children: React.ReactNode;
  className: string;
};
const FadeInView: React.FC<Props> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, amount: 0.5});
  // const isInView = useInView(ref)
  return (
    <div
      ref={ref}
      className={`${className} reveal ${isInView ? 'active' : ''}`}
    >
      {children}
    </div>
  );
};

export default FadeInView;
