import React from 'react';
import SimpleBar, { Props } from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// @ts-ignore
type ScrollProps = Props & { containerRef?: React.Ref<SimpleBar> };
const ScrollContainer: React.FC<ScrollProps> = ({ containerRef, ...props }: ScrollProps) => <SimpleBar {...props} ref={containerRef} />;
export default ScrollContainer;
