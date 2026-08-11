import { useMemo, useState, useEffect } from 'react'

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
  }, [ex.id])

  return (
    <div className="ex">
      <div className="ex-title">Traduis cette phrase</div>
      <div className="ex-prompt" lang={promptLang}>{prompt}</div>

      <div className="answerline">
        {placed.map((t) => (
          <button key={t.id} type="button" className="token token--placed" disabled={locked} onClick={() => setPlaced((p) => p.filter((x) => x.id !== t.id))}>
            {t.tok}
          </button>
        ))}
      </div>

      <div className="tokenbank">
        {bankTokens.map((t) => (
          <button key={t.id} type="button" className="token" disabled={locked} onClick={() => setPlaced((p) => [...p, t])}>
            {t.tok}
          </button>
        ))}
      </div>
    </div>
  )
}
