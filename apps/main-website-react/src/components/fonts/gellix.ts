import localFont from 'next/font/local';

export const gellix = localFont({
  src: [
    {
      weight: '600',
      path: '../../../public/fonts/gellix-semibold-webfont.woff2',
      style: 'normal',
    },
    {
      weight: '500',
      path: '../../../public/fonts/gellix-medium-webfont.woff2',
      style: 'normal',
    },
  ],
});
