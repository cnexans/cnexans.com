import { slugifyHeading } from '@/content/utils'
import type { MDXComponents } from 'mdx/types'
import React from 'react'

function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getTextContent).join('')
  if (React.isValidElement(children)) {
    return getTextContent((children.props as { children?: React.ReactNode }).children)
  }
  return ''
}

function makeHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function HeadingWithId({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const id = slugifyHeading(getTextContent(children))
    return <Tag id={id} {...props}>{children}</Tag>
  }
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: makeHeading('h1'),
    h2: makeHeading('h2'),
    h3: makeHeading('h3'),
    h4: makeHeading('h4'),
    h5: makeHeading('h5'),
    h6: makeHeading('h6'),
  }
}
