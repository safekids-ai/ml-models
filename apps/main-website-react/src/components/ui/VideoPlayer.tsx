'use client'
import React from 'react';
import Modal from './Dialog';
import useDeviceSize from '../../hooks/useDeviceSize';

type Props = {
  videoSrc: string;
  open: boolean;
  setOpen: (prevValue: boolean) => void;
};
const VideoPlayer: React.FC<Props> = ({ videoSrc, open, setOpen }) => {
  const [width] = useDeviceSize();
  return (
    <Modal open={open} setOpen={setOpen}>
      <div>
        <iframe
          id="video"
          width={width > 764 ? 700: width - 64}
          className='rounded-md max-h-[calc(100vh-9rem)]'
          style={{aspectRatio: 16 / 9}}
          src={videoSrc}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default VideoPlayer;
