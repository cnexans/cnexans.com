import fs from 'fs'
import path from 'path'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import { matter } from 'vfile-matter'
import { remark } from 'remark';

type Metadata = {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  originalUri?: string
  toc?: boolean
  tocDepth?: number
}

export type Heading = {
  text: string
  level: number
  id: string
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/`[^`]*`/g, (match) => match.slice(1, -1)) // strip backticks but keep content
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractHeadings(content: string, maxDepth: number = 3): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    if (level <= maxDepth) {
      const text = match[2].trim().replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/`([^`]+)`/g, '$1')
      const id = slugifyHeading(match[2].trim())
      headings.push({ text, level, id })
    }
  }
  return headings
}

export type BlogPost = {
  locale: string
  metadata: Metadata
  content: string
  folder: string
}

async function parseFrontmatter(fileContent: string) {
  const file = await remark()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => (tree, file) => {
      matter(file)
    })
    .process(fileContent)

  const metadata = file.data.matter as Metadata
  const content = String(file)

  return { metadata, content }
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const posts = fs.readdirSync(dir)
  
  const mdxFiles = posts.flatMap((post) => {
    // Prevent reading files that are not directories
    if (!fs.statSync(path.join(dir, post)).isDirectory()) {
      console.warn(`Skipping file ${post} because it is not a directory`)
      return []
    }
    return fs.readdirSync(path.join(dir, post)).map((file) => {
      return path.join(post, file)
    })
  })

  return mdxFiles
    .filter((file) => file.includes('.mdx'))
    .map(async (file: string) => {
    const { metadata, content } = await readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))
    const locale = file.split('.')[0].split('/')[1]
    const folder = file.split('.')[0].split('/')[0]
    return {
      locale,
      metadata: metadata as Metadata,
      slug,
      content,
      folder,
    }
  })
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsPath = path.join(process.cwd(), 'src', 'content', 'blog')
  return await Promise.all(getMDXData(postsPath))
}
