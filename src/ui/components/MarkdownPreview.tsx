import { useCallback, useRef, useEffect, useState, type JSX } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import mermaid from 'mermaid'
import 'highlight.js/styles/github.css'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

let mermaidCounter = 0

function MermaidBlock({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const id = `mermaid-${++mermaidCounter}`
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        setSvg(svg)
        setError('')
      })
      .catch((err) => {
        setError(String(err))
        setSvg('')
      })
  }, [code])

  if (error) {
    return <pre className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</pre>
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function MarkdownPreview({ content }: { content: string }) {
  const renderCode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any): JSX.Element => {
      const { className, children, ...rest } = props
      const match = /language-mermaid/.exec(className || '')
      if (match) {
        const code = String(children).replace(/\n$/, '')
        return <MermaidBlock code={code} />
      }
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      )
    },
    [],
  )

  return (
    <div className="markdown-preview prose max-w-none p-6 overflow-y-auto h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: renderCode,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
