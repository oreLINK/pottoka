import { useMemo, useState, useEffect } from 'react'

// Associer les paires fr <-> eu. Une bonne paire disparaît ; une mauvaise
// clignote. Quand tout est associé, on remonte value = 'done'.
function shuffled(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchPairs({ ex, onChange, locked }) {
  const pairs = ex.payload.pairs
  const left = useMemo(() => shuffled(pairs.map((p, i) => ({ key: i, text: p.fr }))), [ex.id])
  const right = useMemo(() => shuffled(pairs.map((p, i) => ({ key: i, text: p.eu }))), [ex.id])

  const [done, setDone] = useState([]) // clés associées
  const [selL, setSelL] = useState(null)
  const [selR, setSelR] = useState(null)
  const [wrong, setWrong] = useState(false)

  useEffect(() => {
    setDone([]); setSelL(null); setSelR(null); setWrong(false)
  }, [ex.id])

  useEffect(() => {
    if (done.length === pairs.length && pairs.length > 0) onChange('done')
  }, [done])

  function tryMatch(l, r) {
    if (l === r) {
      setDone((d) => [...d, l]); setSelL(null); setSelR(null)
    } else {
      setWrong(true)
      setTimeout(() => { setWrong(false); setSelL(null); setSelR(null) }, 450)
    }
  }

  function pickLeft(k) {
    if (locked || done.includes(k)) return
    setSelL(k)
    if (selR != null) tryMatch(k, selR)
  }
  function pickRight(k) {
    if (locked || done.includes(k)) return
    setSelR(k)
    if (selL != null) tryMatch(selL, k)
  }

  const cls = (k, sel) => 'match-item' + (done.includes(k) ? ' match-item--done' : '') + (sel === k ? (wrong ? ' match-item--wrong' : ' match-item--sel') : '')

  return (
    <div className="ex">
      <div className="ex-title">Associe les paires</div>
      <div className="match">
        <div className="match-col">
          {left.map((it) => (
            <button key={it.key} type="button" className={cls(it.key, selL)} onClick={() => pickLeft(it.key)} disabled={done.includes(it.key)}>
              {it.text}
            </button>
          ))}
        </div>
        <div className="match-col">
          {right.map((it) => (
            <button key={it.key} type="button" className={cls(it.key, selR)} lang="eu" onClick={() => pickRight(it.key)} disabled={done.includes(it.key)}>
              {it.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
