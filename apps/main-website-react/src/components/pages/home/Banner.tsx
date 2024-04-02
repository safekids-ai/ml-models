'use client';
import React, { useEffect, useState } from 'react';
// import Modal from '../../ui/Dialog';
import VideoPlayer from '../../ui/VideoPlayer';
import Link from 'next/link';

const Banner = () => {
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const blockedImage = document.getElementsByClassName(
      'blocked-image-wrapper',
    );
    const images = [
      'images/img4-gun-search.png',
      'images/img4-pause-blocked.png',
    ];
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= images.length) {
        index = 0;
      }
      (blockedImage[0] as HTMLElement).style.backgroundImage =
        `url(${images[index]})`;
      (blockedImage[1] as HTMLElement).style.backgroundImage =
        `url(${images[index]})`;
    }, 4500);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <section className="pb-[3rem] lg:pb-[5rem] pt-[6rem] lg:pt-[9rem]">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <div className="xl:pb-[5rem] 2xl:pr-[5rem] 2xl:pb-[5rem] min-[1920px]:pr-[7rem] min-[1920px]:pb-[5rem] text-center md:text-left">
              <h1 className="beyond__title">
                Bey
                <span className="beyond-icon" />
                nd
                <br />
                <span className="color2">blocking.</span>
              </h1>
              <p className="font-gt-walsheim-pro pb-[2rem] pt-[2rem] px-[1rem] xl:pr-[0] xl:pb-[1.5rem] md:pl-[0px] text-[18px] leading-[24px] sm:text-[20px] sm:leading-[32px] md:text-[18px] md:leading-[30px] lg:text-[24px] lg:leading-[36px]">
                Safe Kids is{' '}
                <Link href="/opensource" className="text-[#0d6efd] underline">
                  opensource
                </Link>{' '}
                and intercepts inappropriate content and teaches children how to
                make safer choices.
              </p>
              <div className="border-btn-small">
                <button
                  className="btn small"
                  onClick={() => setModalOpen(true)}
                >
                  Why Safe Kids?
                  <img
                    src="/images/icon-arrow-btn.svg"
                    className="bg-icon-btn inline"
                    alt=""
                  />
                </button>
                {/* <button id="showModalButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">Show Modal</button> */}
              </div>
              <div className="featured-logos hidden lg:block not-italic font-medium text-lg leading-[45px] xl:leading-[24px] tracking-[0.21em] uppercase pt-[4rem]">
                Featured in
                <br />
                <img
                  src="/images/featured-in-logos.png"
                  alt=""
                  useMap="#image-map"
                />
                <map name="image-map">
                  <area
                    shape="rect"
                    coords="0,0,135,86"
                    href="https://www.fox13news.com/news/teen-creates-app-to-protect-kids-from-social-media-says-total-ban-wont-work"
                    alt="FOX 13"
                  />
                  <area
                    shape="rect"
                    coords="135,0,235,86"
                    href="https://www.globenewswire.com/news-release/2022/09/28/2524695/0/en/Safe-Kids-AI-Launches-New-Gmail-Extension-Aimed-At-Helping-Kids-Make-Better-Decisions-Online.html"
                    alt=""
                  />
                  <area
                    shape="rect"
                    coords="235,0,400,86"
                    href="https://www.aol.com/news/teen-creates-app-protect-kids-033535236.html"
                    alt=""
                  />
                  <area
                    shape="rect"
                    coords="400,0,900,86"
                    href="https://finance.yahoo.com/news/safe-kids-ai-launches-gmail-185100986.html"
                    alt=""
                  />
                  {/* Add more <area> tags for additional clickable areas */}
                </map>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <img
              src="/images/img-banner-home.png"
              className="hidden lg:block 2xl:max-w-[140%] relative 2xl:top-[-98px] 2xl:left-[-130px] lg:max-w-[120%] lg:top-[-98px] lg:left-[-77px]"
              alt=""
            />
            <img
              src="/images/mobile/img-banner-home-mobile.png"
              className="lg:hidden mx-auto"
              alt=""
            />
            <div className="featured-logos lg:hidden not-italic font-medium text-lg leading-[45px] tracking-[0.21em] uppercase pt-[1.5rem]">
              Featured in
              <br />
              <img
                src="/images/featured-in-logos.png"
                className="img-logos"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <VideoPlayer videoSrc='https://www.youtube.com/embed/1KCg9eU9e68?autoplay=1' open={modalOpen} setOpen={setModalOpen} />
    </section>
  );
};

export default Banner;
