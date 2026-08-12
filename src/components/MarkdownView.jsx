// Rendu présentational pur des blocs produits par engine/markdown.js.
export default function MarkdownView({ blocks }) {
  return (
    <div className="md">
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          const Tag = `h${b.level}`
          return <Tag key={i} className={`md-h md-h${b.level}`}>{renderInline(b.content)}</Tag>
        }
        if (b.type === 'list') {
          return (
            <ul key={i} className="md-list">
              {b.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
            </ul>
          )
        }
        return <p key={i} className="md-p">{renderInline(b.content)}</p>
      })}
    </div>
  )
}

function renderInline(segments) {
  return segments.map((seg, i) => {
    if (typeof seg === 'string') return seg
    if (seg.bold) return <strong key={i}>{seg.text}</strong>
    if (seg.italic) return <em key={i}>{seg.text}</em>
    return seg.text
  })
}
