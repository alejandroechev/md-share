import { useState, useEffect, useCallback } from 'react'
import { Editor } from './ui/components/Editor'
import { MarkdownPreview } from './ui/components/MarkdownPreview'
import { encodeMarkdown, decodeMarkdown, isOversized } from './core/url-codec'
import { ShareIcon, DocumentPlusIcon, ClipboardDocumentCheckIcon, EyeIcon, PencilSquareIcon } from './ui/components/icons'

const SAMPLE_MD = `# Welcome to md-share

Write your **markdown** here and share it with a link.

## Features

- Mermaid diagram support
- GFM tables and formatting
- One-click sharing

## Diagram example

\`\`\`mermaid
graph TD
  A[Write Markdown] --> B[Live Preview]
  B --> C[Share Link]
  C --> D[Open in Any Browser]
\`\`\`

## Table example

| Feature   | Status |
|-----------|--------|
| Markdown  | ✅     |
| Mermaid   | ✅     |
| Sharing   | ✅     |
`

function loadFromHash(): string {
  const hash = window.location.hash.slice(1)
  if (!hash) return ''
  return decodeMarkdown(hash)
}

export default function App() {
  const [markdown, setMarkdown] = useState(() => loadFromHash() || SAMPLE_MD)
  const [copied, setCopied] = useState(false)
  const [sizeWarning, setSizeWarning] = useState(false)
  const [previewOnly, setPreviewOnly] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      const content = loadFromHash()
      if (content) setMarkdown(content)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleShare = useCallback(async () => {
    const encoded = encodeMarkdown(markdown)
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`
    window.history.replaceState(null, '', `#${encoded}`)

    if (isOversized(markdown)) {
      setSizeWarning(true)
      setTimeout(() => setSizeWarning(false), 5000)
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      prompt('Copy this link:', url)
    }
  }, [markdown])

  const handleNew = useCallback(() => {
    setMarkdown('')
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Toolbar */}
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white shadow-md">
        <h1 className="text-lg font-bold tracking-tight">md-share</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOnly(!previewOnly)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-gray-700 transition-colors"
            title={previewOnly ? 'Show editor' : 'Full-width preview'}
          >
            {previewOnly ? (
              <>
                <PencilSquareIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            ) : (
              <>
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </button>
          <button
            onClick={handleNew}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-gray-700 transition-colors"
            title="New document"
          >
            <DocumentPlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            title="Share link"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <ShareIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Size warning */}
      {sizeWarning && (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm text-center">
          ⚠️ Document is very large. Some browsers may not support URLs this long.
        </div>
      )}

      {/* Split view / Full preview */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {!previewOnly && (
          <div className="flex-1 border-r border-gray-200 overflow-hidden">
            <Editor value={markdown} onChange={setMarkdown} />
          </div>
        )}
        <div className="flex-1 overflow-hidden bg-white">
          {!previewOnly && (
            <div className="flex items-center px-3 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Preview</span>
            </div>
          )}
          <MarkdownPreview content={markdown} />
        </div>
      </div>
    </div>
  )
}
