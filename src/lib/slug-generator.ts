/**
 * Generate a URL-friendly slug from text
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Generate unique slug by checking database
 */
export async function generateUniqueSlug(
  baseName: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = createSlug(baseName)
  let counter = 1
  
  while (await checkExists(slug)) {
    slug = `${createSlug(baseName)}-${counter}`
    counter++
  }
  
  return slug
}