import { useState, useEffect, useCallback } from 'react'
import { Editor } from './ui/components/Editor'
import { MarkdownPreview } from './ui/components/MarkdownPreview'
import { encodeMarkdown, decodeMarkdown, isOversized } from './core/url-codec'
import { ShareIcon, DocumentPlusIcon, ClipboardDocumentCheckIcon } from './ui/components/icons'

const SAMPLE_MD = `# Bienvenido a md-share

Escribe tu **markdown** aquí y compártelo con un enlace.

## Características

- Soporte para Mermaid diagramas
- Tablas y formato GFM
- Compartir con un solo clic

## Ejemplo de diagrama

\`\`\`mermaid
graph TD
  A[Escribir Markdown] --> B[Vista previa en vivo]
  B --> C[Compartir enlace]
  C --> D[Abrir en cualquier navegador]
\`\`\`

## Tabla de ejemplo

| Característica | Estado |
|---------------|--------|
| Markdown      | ✅     |
| Mermaid       | ✅     |
| Compartir     | ✅     |
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
      prompt('Copia este enlace:', url)
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
            onClick={handleNew}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-gray-700 transition-colors"
            title="Nuevo documento"
          >
            <DocumentPlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            title="Compartir enlace"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">¡Copiado!</span>
              </>
            ) : (
              <>
                <ShareIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Compartir</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Size warning */}
      {sizeWarning && (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 text-sm text-center">
          ⚠️ El documento es grande. Es posible que algunos navegadores no soporten enlaces tan largos.
        </div>
      )}

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="flex-1 border-r border-gray-200 overflow-hidden">
          <Editor value={markdown} onChange={setMarkdown} />
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          <div className="flex items-center px-3 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-600">Vista previa</span>
          </div>
          <MarkdownPreview content={markdown} />
        </div>
      </div>
    </div>
  )
}
