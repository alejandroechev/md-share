import { describe, it, expect } from 'vitest'
import { readFileAsText } from './Editor'

describe('readFileAsText', () => {
  it('reads a text file', async () => {
    const content = '# Hello World'
    const file = new File([content], 'test.md', { type: 'text/markdown' })
    const result = await readFileAsText(file)
    expect(result).toBe(content)
  })

  it('reads a file with unicode', async () => {
    const content = '# Título con ñ'
    const file = new File([content], 'test.md', { type: 'text/markdown' })
    const result = await readFileAsText(file)
    expect(result).toBe(content)
  })
})
