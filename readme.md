<h1 align="center">
  remark-admonition
</h1>

<div align="center">
  <a href="https://npmjs.org/package/remark-admonition">
    <img src="https://badgen.net/npm/v/remark-admonition" alt="version" />
  </a>
  <a href="https://github.com/TomerAberbach/remark-admonition/actions">
    <img src="https://github.com/TomerAberbach/remark-admonition/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://unpkg.com/remark-admonition/dist/index.min.js">
    <img src="https://deno.bundlejs.com/?q=remark-admonition&badge" alt="gzip size" />
  </a>
  <a href="https://unpkg.com/remark-admonition/dist/index.min.js">
    <img src="https://deno.bundlejs.com/?q=remark-admonition&config={%22compression%22:{%22type%22:%22brotli%22}}&badge" alt="brotli size" />
  </a>
</div>

<div align="center">
  A remark plugin for rendering admonitions from directives.
</div>

## Install

```sh
$ npm i remark-admonition
```

## Usage

```js
import { DEFAULT_ADMONITION_TYPES, remarkAdmonition } from 'remark-admonition'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

console.log(
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
```

Output:

```html
<h1>Hello World!</h1>
<section
  data-admonition-name="note"
  data-admonition-label="Note"
  data-admonish="true"
>
  <p>Be careful folks!</p>
</section>
<div
  data-admonition-name="fyi"
  data-admonition-label="title time"
  data-admonish="true"
  style="color: blue;"
>
  <p>Wowowow!</p>
</div>
```

Of course, instead of directly converting to HTML you can write a plugin that
processes the attributes added by this plugin.

## Contributing

Stars are always welcome!

For bugs and feature requests,
[please create an issue](https://github.com/TomerAberbach/remark-admonition/issues/new).

For pull requests, please read the
[contributing guidelines](https://github.com/TomerAberbach/remark-admonition/blob/main/contributing.md).

## License

[Apache License 2.0](https://github.com/TomerAberbach/remark-admonition/blob/main/license)

This is not an official Google product.
