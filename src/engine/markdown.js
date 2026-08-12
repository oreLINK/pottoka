// Mini-parseur Markdown maison (aucune dépendance) pour le contenu des
// cours. Le contenu est écrit à la main par l'auteur du repo, pas saisi par
// un utilisateur — la robustesse aux cas limites compte donc moins que la
// simplicité. Limites connues et acceptées :
//   - pas de gras/italique imbriqués
//   - pas de liens ni de code inline
//   - listes à un seul niveau (pas de sous-listes)
//   - un titre doit être seul dans son paragraphe (pas de texte collé juste après)

// Découpe le texte en pages : chaque titre de niveau 2 (## Titre) démarre une
// nouvelle page. Le texte avant le premier ## (s'il existe) devient une page
// sans en-tête (page d'intro).
export function parseMarkdownPages(raw) {
  const lines = (raw || '').replace(/\r\n/g, '\n').split('\n')
  const pages = []
  let current = { heading: null, lines: [] }
  for (const line of lines) {
    const m = line.match(/^##\s+(.*)$/)
    if (m) {
      pages.push(current)
      current = { heading: m[1].trim(), lines: [] }
    } else {
      current.lines.push(line)
    }
  }
  pages.push(current)

  return pages
    .filter((p) => p.heading || p.lines.some((l) => l.trim()))
    .map((p) => ({
      heading: p.heading,
      // Le titre ## sert de séparateur de page mais reste affiché en tête
      // du contenu de cette page (sinon il disparaîtrait purement et
      // simplement de la lecture).
      blocks: p.heading
        ? [{ type: 'heading', level: 2, content: inline(p.heading) }, ...parseBlocks(p.lines.join('\n'))]
        : parseBlocks(p.lines.join('\n'))
    }))
}

// Découpe le texte d'une page (lignes vides = séparateur) en blocs :
// titres # / ### (## est déjà consommé comme séparateur de page), listes
// (toutes les lignes commencent par "- "), sinon paragraphe.
function parseBlocks(text) {
  const chunks = text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean)
  const blocks = []
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue

    const headingMatch = lines[0].match(/^(#{1,3})\s+(.*)$/)
    if (headingMatch && lines.length === 1) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: inline(headingMatch[2]) })
      continue
    }

    if (lines.every((l) => l.startsWith('- '))) {
      blocks.push({ type: 'list', items: lines.map((l) => inline(l.slice(2))) })
      continue
    }

    blocks.push({ type: 'paragraph', content: inline(lines.join(' ')) })
  }
  return blocks
}

// Découpe un texte en segments {text, bold?, italic?} — **gras** testé avant
// *italique* pour éviter qu'un "**mot**" soit lu comme un italique de "*mot*".
const INLINE_RE = /\*\*(.+?)\*\*|\*(.+?)\*/g

function inline(text) {
  const segments = []
  let lastIndex = 0
  let m
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(text))) {
    if (m.index > lastIndex) segments.push(text.slice(lastIndex, m.index))
    segments.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], italic: true })
    lastIndex = INLINE_RE.lastIndex
  }
  if (lastIndex < text.length) segments.push(text.slice(lastIndex))
  return segments
}
