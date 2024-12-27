import React, { forwardRef, Ref } from 'react';
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SimpleBarCore from 'simplebar';

type ScrollProps = SimpleBarProps & { containerRef?: Ref<SimpleBarCore> };

const ScrollContainer = forwardRef<SimpleBarCore, ScrollProps>(({ containerRef, ...props }, ref) => (
  <SimpleBar {...props} ref={containerRef || ref} />
));

export default ScrollContainer;
