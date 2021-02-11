import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import ContentType from '../types/content'

const postsDirectory = join(process.cwd(), '_contents')

export function getContentSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: Partial<ContentType> = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field as keyof Partial<ContentType>] = data[field]
    }
  })

  return items
}

export function getAllContents(fields: string[] = []) {
  const slugs = getContentSlugs()
  const contents = slugs
    .map((slug) => {
      return getPostBySlug(slug, ['slug',...fields]) as ContentType
    }).sort((data1, data2) => (data1.order < data2.order ? -1 : 1))
  return contents
}
