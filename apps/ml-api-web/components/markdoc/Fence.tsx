'use client';

import { Fragment, useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';
import { cn } from '../../lib/utils';
import localFont from 'next/font/local';

const lexend = localFont({
  src: '../../fonts/lexend.woff2',
  display: 'swap',
  variable: '--font-lexend',
});

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

function CopyButton({ code }: { code: string }) {
  const [copyCount, setCopyCount] = useState(0);
  const copied = copyCount > 0;

  useEffect(() => {
    if (copyCount > 0) {
      const timeout = setTimeout(() => setCopyCount(0), 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copyCount]);

  return (
    <button
      type="button"
      className={cn(
        'group/button absolute right-4 top-3.5 overflow-hidden rounded-full py-[2px] pl-2 pr-3 text-[14px] font-medium backdrop-blur transition focus:opacity-100 group-hover:opacity-100',
        copied
          ? 'bg-sky-600/10 ring-sky-600/10 dark:bg-sky-400/10 ring-1 ring-inset dark:ring-sky-400/20'
          : 'bg-white/5 hover:bg-white/7.5 dark:bg-white/2.5 dark:hover:bg-white/5',
        'opacity-0 md:opacity-100'  
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
          'pointer-events-none flex items-center gap-0.5 text-black dark:text-zinc-400 transition duration-300',
          copied && '-translate-y-1.5 opacity-0'
        )}
      >
        <ClipboardIcon className="h-5 w-5 fill-zinc-800/20 stroke-zinc-800 group-hover/button:stroke-zinc-700 dark:fill-zinc-500/20 dark:stroke-zinc-500 transition-colors dark:group-hover/button:stroke-zinc-400" />
        Copy
      </span>
      <span
        aria-hidden={!copied}
        className={clsx(
          'pointer-events-none absolute inset-0 flex items-center justify-center text-sky-600 dark:text-sky-400 transition duration-300',
          !copied && 'translate-y-1.5 opacity-0'
        )}
      >
        Copied!
      </span>
    </button>
  );
}
export function Fence({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  return (
    <>
      <div>
        <div className="relative">
          <div className="absolute -top-1 -right-1">
            <CopyButton code={children.trimEnd()} />
          </div>
        </div>
        <div className='dark:hidden'>
          <Highlight
            theme={themes.oneLight}
            code={children.trimEnd()}
            language={language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={style}
                className={
                  'rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl m-0'
                }
              >
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    style={{ margin: 10 }}
                  >
                    {/* <span style={{ marginRight: 30 }}>{i + 1 > 9 ? i + 1 : <><span className='invisible'>0</span><span>{i+1}</span></>}</span> */}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
        <div className="hidden dark:block">
          <Highlight
            theme={themes.oneDark}
            code={children.trimEnd()}
            language={language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                style={style}
                className={
                  'rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl m-0'
                }
              >
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    style={{ margin: 10 }}
                  >
                    {/* <span style={{ marginRight: 30 }}>{i + 1 > 9 ? i + 1 : <><span className='invisible'>0</span><span>{i+1}</span></>}</span> */}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </>
  );
}
