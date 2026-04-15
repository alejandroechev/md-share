import { useRef } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (typeof text === 'string') {
        onChange(text)
      }
    }
    reader.readAsText(file)
    // Reset so the same file can be re-uploaded
    e.target.value = ''
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-600">Markdown</span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
          title="Subir archivo .md"
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Subir</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileUpload}
          className="hidden"
          data-testid="file-input"
        />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full p-4 font-mono text-sm resize-none outline-none bg-white border-none"
        placeholder="Escribe o pega tu markdown aquí..."
        spellCheck={false}
      />
    </div>
  )
}

/** Read a File object as text — extracted for testability */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') resolve(result)
      else reject(new Error('Failed to read file'))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
