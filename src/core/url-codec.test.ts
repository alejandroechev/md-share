import { describe, it, expect } from 'vitest'
import { encodeMarkdown, decodeMarkdown, isOversized } from './url-codec'

describe('url-codec', () => {
  it('round-trips simple markdown', () => {
    const md = '# Hello World\n\nThis is **bold** text.'
    const encoded = encodeMarkdown(md)
    expect(encoded).toBeTruthy()
    expect(decodeMarkdown(encoded)).toBe(md)
  })

  it('round-trips markdown with mermaid', () => {
    const md = '```mermaid\ngraph TD\n  A --> B\n```'
    const encoded = encodeMarkdown(md)
    expect(decodeMarkdown(encoded)).toBe(md)
  })

  it('round-trips unicode content', () => {
    const md = '# Título\n\nContenido con acentos: ñ, ü, é'
    expect(decodeMarkdown(encodeMarkdown(md))).toBe(md)
  })

  it('returns empty string for empty input (encode)', () => {
    expect(encodeMarkdown('')).toBe('')
  })

  it('returns empty string for empty input (decode)', () => {
    expect(decodeMarkdown('')).toBe('')
  })

  it('returns empty string for corrupt data', () => {
    expect(decodeMarkdown('not-valid-data!!!')).toBe('')
  })

  it('produces URL-safe characters only', () => {
    const md = 'Test content with special chars: +/= <>!'
    const encoded = encodeMarkdown(md)
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('detects oversized content', () => {
    const small = 'hello'
    expect(isOversized(small)).toBe(false)
    expect(isOversized('')).toBe(false)
  })

  it('round-trips large content', () => {
    const md = '# Large\n\n' + 'Lorem ipsum dolor sit amet. '.repeat(500)
    expect(decodeMarkdown(encodeMarkdown(md))).toBe(md)
  })
})
