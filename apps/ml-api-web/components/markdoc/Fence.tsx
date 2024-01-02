'use client';

import { Fragment, useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import clsx from 'clsx';
import hljs from 'highlight.js/lib/core';
import { cn, highlightCode } from '../../lib/utils';
import localFont from 'next/font/local';
import Prism from 'prismjs'
import { CodeWindow, getClassNameForToken } from '../code/CodeWindow';
import { TabBar } from '../performance/TabBar';
import { Transition } from '@headlessui/react';
import redent from 'redent'
const lexend = localFont({
  src: '../../fonts/lexend.woff2',
  display: 'swap',
  variable: '--font-lexend',
});


const newlineRe = /\r\n|\r|\n/
function normalizeEmptyLines(line) {
  if (line.length === 0) {
    line.push({
      types: ['plain'],
      content: '',
      empty: true,
    })
  } else if (line.length === 1 && line[0].content === '') {
    line[0].empty = true
  }
}
function appendTypes(types, add) {
  const typesSize = types.length
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types
  }

  return types.concat(add)
}
export function CopyButton({ code }) {
  let [{ state, i }, setState] = useState({ state: 'idle', i: 0 })

  useEffect(() => {
    if (state === 'copied') {
      let handle = window.setTimeout(() => {
        setState({ state: 'idle', i: i + 1 })
      }, 1500)
      return () => {
        window.clearTimeout(handle)
      }
    }
  }, [state, i])

  return (
    <div className="relative flex -mr-2">
      <button
        type="button"
        className={clsx({
          'text-slate-500 hover:text-slate-400': state === 'idle',
          'text-sky-400': state === 'copied',
        })}
        onClick={() => {
          navigator.clipboard.writeText(redent(code.replace(/^[+>-]/gm, ' '))).then(() => {
            setState({ state: 'copied', i: i + 1 })
          })
        }}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="w-8 h-8"
        >
          <path d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19" />
          <path d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5" />
        </svg>
      </button>
      <Transition
        className="absolute bottom-full left-1/2 mb-3.5 pb-1 -translate-x-1/2"
        show={state === 'copied'}
        enter="transform ease-out duration-200 transition origin-bottom"
        enterFrom="scale-95 translate-y-0.5 opacity-0"
        enterTo="scale-100 translate-y-0 opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="relative bg-sky-500 text-white font-mono text-[0.625rem] leading-6 font-medium px-1.5 rounded-lg">
          Copied
          <svg
            aria-hidden="true"
            width="16"
            height="6"
            viewBox="0 0 16 6"
            className="text-sky-500 absolute top-full left-1/2 -mt-px -ml-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Transition>
    </div>
  )
}
export function normalizeTokens(tokens) {
  const typeArrStack = [[]]
  const tokenArrStack = [tokens]
  const tokenArrIndexStack = [0]
  const tokenArrSizeStack = [tokens.length]

  let i = 0
  let stackIndex = 0
  let currentLine = []

  const acc = [currentLine]

  while (stackIndex > -1) {
    while ((i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]) {
      let content
      let types = typeArrStack[stackIndex]

      const tokenArr = tokenArrStack[stackIndex]
      const token = tokenArr[i]

      // Determine content and append type to types if necessary
      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain']
        content = token
      } else {
        types = appendTypes(types, token.type)
        if (token.alias) {
          types = appendTypes(types, token.alias)
        }

        content = token.content
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== 'string') {
        stackIndex++
        typeArrStack.push(types)
        tokenArrStack.push(content)
        tokenArrIndexStack.push(0)
        tokenArrSizeStack.push(content.length)
        continue
      }

      // Split by newlines
      const splitByNewlines = content.split(newlineRe)
      const newlineCount = splitByNewlines.length

      currentLine.push({ types, content: splitByNewlines[0] })

      // Create a new line for each string on a new line
      for (let i = 1; i < newlineCount; i++) {
        normalizeEmptyLines(currentLine)
        acc.push((currentLine = []))
        currentLine.push({ types, content: splitByNewlines[i] })
      }
    }

    // Decreate the stack depth
    stackIndex--
    typeArrStack.pop()
    tokenArrStack.pop()
    tokenArrIndexStack.pop()
    tokenArrSizeStack.pop()
  }

  normalizeEmptyLines(currentLine)
  return acc
}
export function Fence({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  const fileName = children.trimEnd().split('\n')[0].substring(2);
  const code = children.trimEnd().split('\n').slice(1).join('\n');
  console.log('code', code)
  const isDiff = language.startsWith('diff-');
  const prismLang = isDiff ? language.substring(0, 5) : language;
  console.log('language', language)
  const grammar = Prism.languages[isDiff ? 'diff' : prismLang];
  console.log(Prism.languages)
  const tokens = Prism.tokenize(code, grammar);
  const lines = normalizeTokens(tokens);
  console.log('lines', lines)
  return (
    <div className='flex flex-col m-0 gap-0 rounded-xl bg-gray-900 dark:bg-inherit'>
      <TabBar
          side="left"
          translucent={true}
          primary={{ name: fileName, saved: true }}
        >
          <CopyButton code={code} />
        </TabBar>
        <CodeWindow.Code2 lines={lines.length}>
          {lines.map((tokens, lineIndex) => (
            <div key={lineIndex}>
              {tokens.map((token, tokenIndex) => {
                return (
                  <span
                    key={tokenIndex}
                    className={getClassNameForToken(token)}
                  >
                    {token.content}
                  </span>
                );
              })}
            </div>
          ))}
        </CodeWindow.Code2> 
    </div>
  );
}
export function Fenced({
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
        <div className="dark:hidden">
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
