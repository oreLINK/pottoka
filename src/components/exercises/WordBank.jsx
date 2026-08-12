import { useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react'

// Construction d'une phrase avec des blocs de mots (+ quelques blocs parasites).
// value remontée = tableau ordonné des mots placés.
export default function WordBank({ ex, onChange, locked }) {
  const { prompt, promptLang, answer, distractors = [] } = ex.payload

  // Jeton stable : { id, tok }. Mélangé une seule fois par exercice.
  const initial = useMemo(() => {
    const toks = [...answer, ...distractors].map((tok, i) => ({ id: i, tok }))
    for (let i = toks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[toks[i], toks[j]] = [toks[j], toks[i]]
    }
    return toks
  }, [ex.id])

  const [placed, setPlaced] = useState([]) // liste de jetons dans l'ordre
  const placedIds = new Set(placed.map((t) => t.id))
  const bankTokens = initial.filter((t) => !placedIds.has(t.id))

  useEffect(() => {
    onChange(placed.map((t) => t.tok))
  }, [placed])

  useEffect(() => {
    setPlaced([]) // reset quand on change d'exercice
    rectsRef.current = new Map()
  }, [ex.id])

  // Anime le déplacement d'un jeton entre la liste et la phrase (technique
  // FLIP) : on capture sa position juste avant le déplacement, puis on le
  // fait "voler" depuis cette position jusqu'à sa nouvelle place.
  const nodeRefs = useRef(new Map()) // id -> élément DOM
  const rectsRef = useRef(new Map()) // id -> DOMRect avant le dernier changement

  function registerNode(id, el) {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }

  function captureRects() {
    const map = new Map()
    nodeRefs.current.forEach((el, id) => map.set(id, el.getBoundingClientRect()))
    rectsRef.current = map
  }

  useLayoutEffect(() => {
    const prevRects = rectsRef.current
    if (prevRects.size) {
      nodeRefs.current.forEach((el, id) => {
        const prev = prevRects.get(id)
        if (!prev) return
        const next = el.getBoundingClientRect()
        const dx = prev.left - next.left
        const dy = prev.top - next.top
        if (dx || dy) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
            { duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
          )
        }
      })
    }
    rectsRef.current = new Map()
  }, [placed])

  function place(t) {
    captureRects()
    setPlaced((p) => [...p, t])
  }
  function unplace(id) {
    captureRects()
    setPlaced((p) => p.filter((x) => x.id !== id))
  }

  return (
    <div className="ex">
      <div className="ex-title">Traduis cette phrase</div>
      <div className="ex-prompt" lang={promptLang}>{prompt}</div>

      <div className="answerline">
        {placed.map((t) => (
          <button
            key={t.id}
            ref={(el) => registerNode(t.id, el)}
            type="button"
            className="token token--placed"
            disabled={locked}
            onClick={() => unplace(t.id)}
          >
            {t.tok}
          </button>
        ))}
      </div>

      <div className="tokenbank">
        {bankTokens.map((t) => (
          <button
            key={t.id}
            ref={(el) => registerNode(t.id, el)}
            type="button"
            className="token"
            disabled={locked}
            onClick={() => place(t)}
          >
            {t.tok}
          </button>
        ))}
      </div>
    </div>
  )
}
