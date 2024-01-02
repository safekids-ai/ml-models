'use client';

import { Disclosure, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  InboxIcon,
  MinusSmallIcon,
  PlusSmallIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {
  lines as html,
  code as htmlCode,
} from '../components/samples/curl.txt?highlight=txt';
import redent from 'redent';
import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '../lib/utils';
import { Hero } from '../components/pages/homepage/Hero';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  CodeWindow,
  getClassNameForToken,
} from '../components/code/CodeWindow';
import { TabBar } from '../components/performance/TabBar';
import clsx from 'clsx';
import { Fence } from '../components/markdoc/Fence';
import { NLPLabel } from '@safekids-ai/nlp-js-types';
import localFont from 'next/font/local';

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
];
const ApiFeatures = [
  {
    name: 'Unlimited inboxes',
    description:
      'Non quo aperiam repellendus quas est est. Eos aut dolore aut ut sit nesciunt. Ex tempora quia. Sit nobis consequatur dolores incidunt.',
    href: '/nsfw',
    icon: InboxIcon,
  },
  {
    name: 'Manage team members',
    description:
      'Vero eum voluptatem aliquid nostrum voluptatem. Vitae esse natus. Earum nihil deserunt eos quasi cupiditate. A inventore et molestiae natus.',
    href: '/nsfw',
    icon: UsersIcon,
  },
  {
    name: 'Spam report',
    description:
      'Et quod quaerat dolorem quaerat architecto aliquam accusantium. Ex adipisci et doloremque autem quia quam. Quis eos molestiae at iure impedit.',
    href: '/nsfw',
    icon: TrashIcon,
  },
];
const ProductFeatures = [
  {
    name: 'NSFW',
    description:
      'Non quo aperiam repellendus quas est est. Eos aut dolore aut ut sit nesciunt. Ex tempora quia. Sit nobis consequatur dolores incidunt.',
    href: '/nsfw',
    icon: InboxIcon,
  },
  {
    name: 'Category on server',
    description:
      'Vero eum voluptatem aliquid nostrum voluptatem. Vitae esse natus. Earum nihil deserunt eos quasi cupiditate. A inventore et molestiae natus.',
    href: '/nsfw',
    icon: UsersIcon,
  },
  {
    name: 'Safekids is the best!',
    description:
      'Et quod quaerat dolorem quaerat architecto aliquam accusantium. Ex adipisci et doloremque autem quia quam. Quis eos molestiae at iure impedit.',
    href: '/nsfw',
    icon: TrashIcon,
  },
];
const lexend = localFont({
  src: '../fonts/lexend.woff2',
  display: 'swap',
  variable: '--font-lexend',
});
const tiers = [
  {
    name: 'Hobby',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$19',
    description:
      "The perfect plan if you're just getting started with our product.",
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
    ],
    featured: false,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$49',
    description: 'Dedicated support and infrastructure for your company.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    featured: true,
  },
];
const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];
const footerNavigation = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
};
function CopyButton({ code }) {
  let [{ state, i }, setState] = useState({ state: 'idle', i: 0 });

  useEffect(() => {
    if (state === 'copied') {
      let handle = window.setTimeout(() => {
        setState({ state: 'idle', i: i + 1 });
      }, 1500);
      return () => {
        window.clearTimeout(handle);
      };
    }
  }, [state, i]);

  return (
    <div className="relative flex -mr-2">
      <button
        type="button"
        className={clsx({
          'text-slate-500 hover:text-slate-400': state === 'idle',
          'text-sky-400': state === 'copied',
        })}
        onClick={() => {
          navigator.clipboard
            .writeText(redent(code.replace(/^[+>-]/gm, ' ')))
            .then(() => {
              setState({ state: 'copied', i: i + 1 });
            });
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
  );
}
type Result = {
  flag: boolean;
  label?: string;
  flaggedText?: string;
};
type ResultWithInput = {
  flag: boolean;
  label?: string;
  flaggedText?: string;
  input: string;
};
const fixInput = (input: string): React.JSX.Element => {
  console.log(input)
  return (
    <>
      {input.split('\n').length > 1 ? (
        input.split('\n').map((val, index) => (
          <div key={index}>
            {val}
          </div>
        ))
      ) : (
        <>{input}</>
      )}
    </>
  );
};
function mockAPI(text: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (text === 'I hate you\nd\na') {
        resolve({
          flag: true,
          label: 'hate_bullying',
          flaggedText: 'I hate you',
        });
      } else {
        resolve({ flag: false, label: 'clean', flaggedText: '' });
      }
    }, 1000);
  });
}
export default function Example() {
  const [input, setInputValue] = useState('I hate you\nd\na');
  const [results, setResults] = useState<Array<ResultWithInput> | Array<never>>(
    []
  );
  console.log(htmlCode);
  const handleGetResult = async () => {
    const realInput = input.trim();
    const result = await mockAPI(realInput);
    console.log(
      result.flag
        ? { ...result, input: realInput }
        : { flag: false, flaggedText: '', label: 'clean', input: realInput }
    );
    setResults([
      ...results,
      result.flag
        ? {
            ...result,
            input: realInput,
          }
        : {
            flag: false,
            flaggedText: '',
            label: 'clean',
            input: realInput,
          },
    ]);
  };
  return (
    <div className="bg-white dark:text-white w-screen dark:bg-gray-900">
      {/* Header */}
      <main>
        {/* Hero section */}
        <Hero />
        <h1
          className={cn(
            'dark:text-white flex w-screen justify-center items-start m-4 p-4 text-[30px] font-semibold',
            'mb-8'
          )}
        >
          Try it out
        </h1>
        <div className="w-screen flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 container justify-center m-4">
            <div className="bg-gray-900 h-full w-full flex flex-col rounded-lg">
              <textarea
                className="text-white p-6 bg-inherit h-full w-full rounded-lg"
                style={{ resize: 'none' }}
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <div className="relative">
                <div className="absolute right-[15px] bottom-[6px] text-white hover:bg-indigo-400/80 dark:hover:bg-indigo-600/80 dark:bg-indigo-600 bg-indigo-400 p-2 rounded-2xl hover:cursor-pointer">
                  <button onClick={handleGetResult}>Get result</button>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full bg-gray-900 rounded-lg">
              <TabBar
                side="left"
                translucent={true}
                primary={{ name: 'Result', saved: true }}
              >
                {}
              </TabBar>

              <div className={'ml-2 p-4 ' + lexend.className}>
                {results.map((val, index) =>
                  val.flag ? (
                    <div key={index} className='text-white'>
                      <span className="text-red-500 font-semibold">
                        {index + 1}.
                      </span>{' '}
                      {fixInput(
                        val.input.split(
                          val.flaggedText ? val.flaggedText : ''
                        )[0]
                      )}
                      <span className="text-red-500 font-semibold">
                        {fixInput(val.flaggedText ? val.flaggedText : '')}
                      </span>
                      {fixInput(
                        val.input.split(
                          val.flaggedText ? val.flaggedText : ''
                        )[1]
                      )}
                      <hr></hr>
                    </div>
                  ) : (
                    <div key={index} className="text-green-400">
                      {index + 1}. The text is clean:{' '}
                      <span className="font-semibold text-white">
                        {fixInput(val.input)}
                      </span>
                      <hr></hr>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Feature section */}
        <div className="bg-white dark:bg-inherit py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Stay on top of api stuff
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus
                magnam voluptatum cupiditate veritatis in accusamus quisquam.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {ApiFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-400">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-white">
                      <p className="flex-auto">{feature.description}</p>
                      <p className="mt-6">
                        <Link
                          href={feature.href}
                          className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
                        >
                          Learn more <span aria-hidden="true">→</span>
                        </Link>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-inherit py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Stay on top of customer support
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus
                magnam voluptatum cupiditate veritatis in accusamus quisquam.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {ProductFeatures.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-400">
                        <feature.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-white">
                      <p className="flex-auto">{feature.description}</p>
                      <p className="mt-6">
                        <Link
                          href={feature.href}
                          className="text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400"
                        >
                          Learn more <span aria-hidden="true">→</span>
                        </Link>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        {/* Pricing section */}
        <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-inherit">
          <div
            className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
            aria-hidden="true"
          >
            <div
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
              Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              The right price for you, whoever you are
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-white">
            Qui iusto aut est earum eos quae. Eligendi est at nam aliquid ad quo
            reprehenderit in aliquid fugiat dolorum voluptatibus.
          </p>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
            {tiers.map((tier, tierIdx) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? 'relative bg-white dark:bg-gray-800 shadow-2xl'
                    : 'bg-white/60 dark:bg-gray-800/60 sm:mx-8 lg:mx-0',
                  tier.featured
                    ? ''
                    : tierIdx === 0
                    ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                    : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
                  'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
                )}
              >
                <h3
                  id={tier.id}
                  className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400"
                >
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tier.priceMonthly}
                  </span>
                  <span className="text-base text-gray-500 dark:text-white">
                    /month
                  </span>
                </p>
                <p className="mt-6 text-base leading-7 text-gray-600 dark:text-white">
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600 sm:mt-10 dark:text-white"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    tier.featured
                      ? 'bg-indigo-600 text-white shadow hover:bg-indigo-500'
                      : 'text-indigo-600 dark:text-white dark:bg-gray-300/10 dark:hover:bg-gray-300/20 dark:ring-0 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10'
                  )}
                >
                  Get started today
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                          <span className="text-base font-semibold leading-7">
                            {faq.question}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600 dark:text-white">
                          {faq.answer}
                        </p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="mt-32 bg-gray-900 sm:mt-56"
        aria-labelledby="footer-heading"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <img
              className="h-7"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Company name"
            />
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Solutions
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Support
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.support.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    Legal
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className="text-sm leading-6 text-gray-300 hover:text-white"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
