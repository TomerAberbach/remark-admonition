/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Properties } from 'hast'
import type { Root } from 'mdast'
import type { ContainerDirectiveData } from 'mdast-util-directive'
import remarkStringify from 'remark-stringify'
import stripMarkdown from 'strip-markdown'
import type { Plugin } from 'unified'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { ReadonlyDeep } from 'type-fest'
import 'mdast-util-to-hast'

export const remarkAdmonition: Plugin<
  [(ReadonlyDeep<RemarkAdmonitionOptions> | null | undefined)?],
  Root,
  Root
> = options => {
  const {
    defaultElement = `div`,
    defaultProperties = { role: `note` },
    types = DEFAULT_ADMONITION_TYPES,
  } = options ?? {}
  return (tree: Root) =>
    visit(tree, `containerDirective`, directive => {
      const { name, data = {}, children } = directive
      const type = types.get(name)
      if (!type) {
        return
      }

      const [labelChild, contentChildren] = children[0]?.data?.directiveLabel
        ? [children[0], children.slice(1)]
        : [null, children]
      const label = labelChild
        ? String(
            markdownStrippingProcessor.stringify(
              markdownStrippingProcessor.runSync({
                type: `root`,
                children: [labelChild],
              }),
            ),
          ).trim()
        : type.defaultLabel

      directive.data = Object.assign(data, {
        hName: type.element ?? defaultElement,
        hProperties: {
          'data-admonition-name': name,
          ...(label && { 'data-admonition-label': label }),
          ...defaultProperties,
          ...type.properties,
        },
      } satisfies ContainerDirectiveData)
      directive.children = contentChildren
    })
}

export type RemarkAdmonitionOptions = {
  defaultElement?: string
  defaultProperties?: Properties
  types?: Map<string, Admonition>
}

export type Admonition = {
  defaultLabel?: string
  element?: string
  properties?: Properties
}

export const DEFAULT_ADMONITION_TYPES: ReadonlyDeep<Map<string, Admonition>> =
  new Map([
    [`note`, { defaultLabel: `Note` }],
    [`tip`, { defaultLabel: `Tip` }],
    [`warning`, { defaultLabel: `Warning` }],
    [`danger`, { defaultLabel: `Danger` }],
  ])

const markdownStrippingProcessor = unified()
  .use(stripMarkdown)
  .use(remarkStringify)
  .freeze()

/* eslint-disable typescript/consistent-type-definitions */
declare module 'mdast' {
  interface Data {
    directiveLabel?: boolean
  }
}
/* eslint-enable typescript/consistent-type-definitions */
