//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { composePlugins, withNx } from '@nx/next';
import withMarkdoc from '@markdoc/next.js';
import withSearch from './markdoc/search.mjs';
import { createLoader } from 'simple-functional-loader';
import {
  simplifyToken,
  normalizeTokens,
  fixSelectorEscapeTokens,
  highlightCode,
} from './remark/utils.mjs';
import Prism from 'prismjs';
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        port: '',
        pathname: '/img/component-images/**',
      },
    ],
  },
  webpack(config, options) {
    config.module.rules.push({
      resourceQuery: /highlight/,
      use: [
        options.defaultLoaders.babel,
        createLoader(function (source) {
          let lang =
            new URLSearchParams(this.resourceQuery).get('highlight') ||
            this.resourcePath.split('.').pop();
          let isDiff = lang.startsWith('diff-');
          let prismLang = isDiff ? lang.substr(5) : lang;
          let grammar = Prism.languages[isDiff ? 'diff' : prismLang];
          let tokens = Prism.tokenize(source, grammar, lang);

          if (lang === 'css') {
            fixSelectorEscapeTokens(tokens);
          }

          return `
            export const tokens = ${JSON.stringify(tokens.map(simplifyToken))}
            export const lines = ${JSON.stringify(normalizeTokens(tokens))}
            export const code = ${JSON.stringify(source)}
            export const highlightedCode = ${JSON.stringify(
              highlightCode(source, lang)
            )}
          `;
        }),
      ],
    });

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(
  withSearch(withMarkdoc({ schemaPath: './markdoc' })(nextConfig))
);
