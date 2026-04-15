import { deflate, inflate } from 'pako'

/** Compress markdown string and encode as URL-safe base64 */
export function encodeMarkdown(md: string): string {
  if (!md) return ''
  const compressed = deflate(new TextEncoder().encode(md))
  return base64UrlEncode(compressed)
}

/** Decode URL-safe base64 back to markdown string */
export function decodeMarkdown(hash: string): string {
  if (!hash) return ''
  try {
    const compressed = base64UrlDecode(hash)
    const decompressed = inflate(compressed)
    return new TextDecoder().decode(decompressed)
  } catch {
    return ''
  }
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (str.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const MAX_RECOMMENDED_SIZE = 50_000

/** Check if compressed content exceeds the recommended URL size */
export function isOversized(md: string): boolean {
  if (!md) return false
  const encoded = encodeMarkdown(md)
  return encoded.length > MAX_RECOMMENDED_SIZE
}
