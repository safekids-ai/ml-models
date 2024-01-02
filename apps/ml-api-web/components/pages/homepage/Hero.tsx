'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import Typed from 'typed.js';
import { Highlight, themes } from 'prism-react-renderer';
import { Fragment, useEffect, useState } from 'react';

const codeBlock = `$ curl -X POST \n   -d <span class="text-sky-400">'{"message":"hello"}'</span> \n   <span>https://api.safekids.ai/v1/classify-text</span>`;
const copyBlock = `curl -X POST -d '{"message":"hello"}' https://api.safekids.ai/v1/classify-text`;

import React, { useRef } from 'react';
import { cn } from '../../../lib/utils';
import { features } from 'process';

function ClipboardIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path
        strokeWidth="0"
        d="M5.5 13.5v-5a2 2 0 0 1 2-2l.447-.894A2 2 0 0 1 9.737 4.5h.527a2 2 0 0 1 1.789 1.106l.447.894a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2Z"
      />
      <path
        fill="none"
        strokeLinejoin="round"
        d="M12.5 6.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2m5 0-.447-.894a2 2 0 0 0-1.79-1.106h-.527a2 2 0 0 0-1.789 1.106L7.5 6.5m5 0-1 1h-3l-1-1"
      />
    </svg>
  );
}

function CopyButton({ code, visible }: { code: string; visible: boolean }) {
  let [copyCount, setCopyCount] = useState(0);
  let copied = copyCount > 0;

  useEffect(() => {
    if (copyCount > 0) {
      let timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copyCount]);

  return (
    <button
      type="button"
      className={cn(
        'group/button absolute right-4 top-3.5 overflow-hidden rounded-full py-[2px] pl-2 pr-3 text-[14px] font-medium opacity-0 backdrop-blur transition hover:opacity-100 focus:opacity-100 group-hover:opacity-100',
        copied
          ? 'bg-sky-400/10 ring-1 ring-inset ring-sky-400/20'
          : 'bg-white/5 hover:bg-white/7.5 dark:bg-white/2.5 dark:hover:bg-white/5',
        {
          'opacity-100': visible,
        }
      )}
      onClick={() => {
        window.navigator.clipboard.writeText(code).then(() => {
          setCopyCount((count) => count + 1);
        });
      }}
    >
      <span
        aria-hidden={copied}
        className={clsx(
          'pointer-events-none flex items-center gap-0.5 text-zinc-400 transition duration-300',
          copied && '-translate-y-1.5 opacity-0'
        )}
      >
        <ClipboardIcon className="h-5 w-5 fill-zinc-500/20 stroke-zinc-500 transition-colors group-hover/button:stroke-zinc-400" />
        Copy
      </span>
      <span
        aria-hidden={!copied}
        className={clsx(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-sky-400 transition duration-300',
          !copied && 'translate-y-1.5 opacity-0'
        )}
      >
        Copied!
      </span>
    </button>
  );
}

export const Code = () => {
  const el = useRef<HTMLPreElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const pre = el?.current;
    const typed = new Typed(el.current, {
      strings: [codeBlock],
      typeSpeed: 20,
      loop: false,
      cursorChar: '_',
      onComplete: function (self) {
        self.cursor.style.visibility = 'hidden';
      },
    });
    const handleEventListener = () => {
      setIsVisible(true);
    };
    const handleMouseOut = () => {
      setIsVisible(false);
    };
    pre?.addEventListener('mouseover', handleEventListener);
    pre?.addEventListener('mouseout', handleMouseOut);
    // Destropying
    return () => {
      typed.destroy();
      pre?.removeEventListener('mouseover', handleEventListener);
      pre?.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  return (
    <div className="terminal-window mx-2 overflow-x-auto sm:w-[550px] w-[70%] p-6 text-base sm:text-sm md:text-base rounded-md shadow-2xl bg-gray-800 max-h-80">
      <div className="relative">
        <div className="absolute -top-5 -right-5">
          <CopyButton code={copyBlock} visible={isVisible} />
        </div>
      </div>

      <pre className="text-gray-300 whitespace-pre" ref={el}></pre>
      <button className="text-white bg-red-500 rounded-full z-[1000000000] p-[4px] mt-2 sm:ml-[420px] ml-[55%] w-[100px]">
        Try it out <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};
export function Test() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div>
            <div className="relative isolate pt-14">
              <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl sm:-top-80 overflow-x-hidden"
                aria-hidden="true"
              >
                <div
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
              <div className="pt-24 sm:pt-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl break-words overflow-hidden dark:text-white">
                      Models to help detect NSFW images and text
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 break-words overflow-hidden dark:text-white">
                      Use these models that can run on the browser today! It is
                      as simple as 10 lines of code.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <Link
                        href="/docs"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
                      >
                        Get started
                      </Link>
                      <a
                        href="#"
                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-16 flow-root sm:mt-24">
                    <div className="flex justify-center align-middle">
                      <Code />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-x-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
              >
                <div
                  className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <img
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export function Hero() {
  return (
    <div className="overflow-x-clip overflow-y-visible bg-white dark:bg-gray-900 pb-24 sm:pb-32 w-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 align-middle justify-end xl:gap-x-40">
          <div>
            <div className="relative isolate pt-14">
              <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl sm:-top-80 overflow-x-hidden"
                aria-hidden="true"
              >
                <div
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
              <div className="pt-24 sm:pt-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl break-words overflow-hidden dark:text-white">
                      Models to help detect NSFW images and text
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 break-words overflow-hidden dark:text-white">
                      Use these models that can run on the browser today! It is
                      as simple as 10 lines of code.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <Link
                        href="/docs"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-400"
                      >
                        Get started
                      </Link>
                      <a
                        href="#"
                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                  <div className="mt-16 flow-root sm:mt-24">
                    <div className="flex justify-center align-middle">
                      <Code />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-x-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
              >
                <div
                  className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden pt-16 lg:hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Image
                src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                alt="App screenshot"
                className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
                width={2432}
                height={1442}
              />
            </div>
          </div>
          <div className="h-full m-auto align-middle lg:justify-end hidden lg:flex">
            <div className="m-auto">
              <Image
                src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <Highlight
                    theme={themes.shadesOfPurple}
                    code={codeBlock}
                    language="tsx"
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps,
                    }) => (
                      <pre
                        style={style}
                        className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
                      >
                        {tokens.map((line, i) => (
                          <div
                            key={i}
                            {...getLineProps({ line })}
                            style={{ margin: 10 }}
                          >
                            <span style={{ marginRight: 20 }}>{i + 1}</span>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight> */
}
// export function Hero() {
//   const { theme, setTheme } = useTheme()

//   return (
//     <div className="overflow-hidden bg-slate-900 dark:-mb-32 dark:mt-[-4.75rem] dark:pb-32 dark:pt-[4.75rem]">
//       <div className="py-16 sm:px-2 lg:relative lg:px-0 lg:py-20">
//         <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
//           <div className="relative z-10 md:text-center lg:text-left">
//             <Image
//               className="absolute bottom-full right-full -mb-56 -mr-72 opacity-50"
//               src={blurCyanImage}
//               alt=""
//               width={530}
//               height={530}
//               unoptimized
//               priority
//             />
//             <div className="relative">
//               <p className="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">
//                 Never miss the cache again.
//               </p>
//               <p className="mt-3 text-2xl tracking-tight text-slate-400">
//                 Cache every single thing your app could ever do ahead of time,
//                 so your code never even has to run at all.
//               </p>
//               <div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
//                 <Button href="/">Get started</Button>
//                 <Button href="/" variant="secondary">
//                   View on GitHub
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="relative lg:static xl:pl-10">
//             <div className="absolute inset-x-[-50vw] -bottom-48 -top-32 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:-bottom-32 lg:-top-32 lg:left-[calc(50%+14rem)] lg:right-0 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]">
//               <HeroBackground className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]" />
//             </div>
//             <div className="relative">
//               <Image
//                 className="absolute -right-64 -top-64"
//                 src={blurCyanImage}
//                 alt=""
//                 width={530}
//                 height={530}
//                 unoptimized
//                 priority
//               />
//               <Image
//                 className="absolute -bottom-40 -right-44"
//                 src={blurIndigoImage}
//                 alt=""
//                 width={567}
//                 height={567}
//                 unoptimized
//                 priority
//               />
//               <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
//               <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
//               <div className="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
//                 <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
//                 <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
//                 <div className="pl-4 pt-4">
//                   <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />
//                   <div className="mt-4 flex space-x-2 text-xs">
//                     {tabs.map((tab) => (
//                       <div
//                         key={tab.name}
//                         className={clsx(
//                           'flex h-6 rounded-full',
//                           tab.isActive
//                             ? 'bg-gradient-to-r from-sky-400/30 via-sky-400 to-sky-400/30 p-px font-medium text-sky-300'
//                             : 'text-slate-500',
//                         )}
//                       >
//                         <div
//                           className={clsx(
//                             'flex items-center rounded-full px-2.5',
//                             tab.isActive && 'bg-slate-800',
//                           )}
//                         >
//                           {tab.name}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="mt-6 flex items-start px-1 text-sm">
//                     <div
//                       aria-hidden="true"
//                       className="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600"
//                     >
//                       {Array.from({
//                         length: code.split('\n').length,
//                       }).map((_, index) => (
//                         <Fragment key={index}>
//                           {(index + 1).toString().padStart(2, '0')}
//                           <br />
//                         </Fragment>
//                       ))}
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
