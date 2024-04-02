import Head from 'next/head';
import Header from '../components/header/Header';
import JsClient from '../components/js/JsClient';
import './global.css';
import { Red_Hat_Display } from 'next/font/google';
import Footer from '../components/footer/Footer';

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  display: 'swap',
});
export const metadata = {
  title: 'Welcome to Safe Kids',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <script
          src="https://kit.fontawesome.com/fbadad80a0.js"
          crossOrigin="anonymous"
          defer
        ></script>
      </Head>
      <body className={redHatDisplay.className}>
        {/* <JsClient> */}
          <div id="contentWrapper">
            <Header />
            {children}
            <Footer />
          </div>
        {/* </JsClient> */}
      </body>
    </html>
  );
}
