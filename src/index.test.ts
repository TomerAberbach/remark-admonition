import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { expect, test } from 'vitest'
import { DEFAULT_ADMONITION_TYPES, remarkAdmonition } from './index.js'

test(`remarkAdmonition works without options`, () => {
  const html = String(
    unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkAdmonition)
      .use(remarkRehype)
      .use(rehypeStringify).processSync(`
# Hello World!

:::note
Be careful folks!
:::

:::fyi[**title** time]
Wowowow!
:::
    `),
  )

  expect(html).toMatchInlineSnapshot(`
"<h1>Hello World!</h1>
<div data-admonition-name="note" data-admonition-label="Note" role="note"><p>Be careful folks!</p></div>
<div><p><strong>title</strong> time</p><p>Wowowow!</p></div>"
`)
})

test(`remarkAdmonition works with options`, () => {
  const html = String(
    unified()
      .use(remarkParse)
      .use(remarkDirective)
      .use(remarkAdmonition, {
        defaultElement: `section`,
        defaultProperties: { 'data-admonish': `true` },
        types: new Map([
          ...DEFAULT_ADMONITION_TYPES,
          [
            `fyi`,
            {
              defaultLabel: `FYI`,
              element: `div`,
              properties: { style: `color: blue;` },
            },
          ],
        ]),
      })
      .use(remarkRehype)
      .use(rehypeStringify).processSync(`
# Hello World!

:::note
Be careful folks!
:::

:::fyi[**title** time]
Wowowow!
:::
    `),
  )

  expect(html).toMatchInlineSnapshot(`
"<h1>Hello World!</h1>
<section data-admonition-name="note" data-admonition-label="Note" data-admonish="true"><p>Be careful folks!</p></section>
<div data-admonition-name="fyi" data-admonition-label="title time" data-admonish="true" style="color: blue;"><p>Wowowow!</p></div>"
`)
})
