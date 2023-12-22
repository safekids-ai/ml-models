import { type Node } from '@markdoc/markdoc'

import { DocsHeader } from './DocsHeader'
import { PrevNextLinks } from './PrevNextLinks'
import { Prose } from './Prose'
import { TableOfContents } from './TableOfContents'
import { collectSections } from '../../lib/sections'

export function DocsLayout({
  children,
  frontmatter: { title },
  nodes,
}: {
  children: React.ReactNode
  frontmatter: { title?: string }
  nodes: Array<Node>
}) {
  let tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 scroll-my-16 scroll-mx-4 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16 scroll-smooth" id="docs">
        <article>
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  )
}
