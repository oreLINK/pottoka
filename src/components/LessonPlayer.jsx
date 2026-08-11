import { useState, useMemo, useEffect } from 'react'
import ExerciseRenderer from './exercises/ExerciseRenderer'
import Pottoka from './Pottoka'
import { grade, canCheck } from '../engine/grade'

const START_HEARTS = 5

// Icône croix pour fermer
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function IconHeart({ filled }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-7.5-4.6-10-9.2C.6 8.9 2 5.5 5.2 5.5c2 0 3.2 1.2 3.8 2.2.6-1 1.8-2.2 3.8-2.2 3.2 0 4.6 3.4 3.2 6.3C15.5 16.4 12 21 12 21z"
        transform="translate(1 -2)"
        fill={filled ? '#D8232A' : '#E5E5E5'}
      />
    </svg>
  )
}

export default function LessonPlayer({ lesson, exercises, onComplete, onQuit }) {
  const total = exercises.length
  const [index, setIndex] = useState(0)
  const [hearts, setHearts] = useState(START_HEARTS)
  const [answer, setAnswer] = useState(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [failed, setFailed] = useState(false)

  const ex = exercises[index]

  // reset de la réponse à chaque exercice
  useEffect(() => {
    setAnswer(null)
    setChecked(false)
    setCorrect(false)
  }, [index])

  // les associations se valident toutes seules une fois complètes
  useEffect(() => {
    if (ex?.type === 'match_pairs' && answer === 'done' && !checked) {
      setChecked(true)
      setCorrect(true)
      setCorrectCount((c) => c + 1)
    }
  }, [answer, ex, checked])

  const progress = useMemo(() => Math.round((index / total) * 100), [index, total])
  const ready = canCheck(ex, answer)

  function handleCheck() {
    const ok = grade(ex, answer)
    setCorrect(ok)
    setChecked(true)
    if (ok) {
      setCorrectCount((c) => c + 1)
    } else {
      const left = hearts - 1
      setHearts(left)
      if (left <= 0) setFailed(true)
    }
  }

  function handleContinue() {
    if (index + 1 >= total) {
      onComplete({ passed: true, xp: lesson.xp || 10, correctCount, total })
    } else {
      setIndex((i) => i + 1)
    }
  }

  function retry() {
    setIndex(0); setHearts(START_HEARTS); setAnswer(null)
    setChecked(false); setCorrect(false); setCorrectCount(0); setFailed(false)
  }

  if (failed) {
    return (
      <div className="lesson lesson--end">
        <Pottoka expression="sad" size={140} />
        <h2>Plus de cœurs…</h2>
        <p className="muted">Ce n'est pas grave, on retente ! Chaque erreur fait progresser.</p>
        <button className="btn btn--primary" onClick={retry}>Réessayer</button>
        <button className="btn btn--ghost" onClick={onQuit}>Quitter</button>
      </div>
    )
  }

  const isMatch = ex.type === 'match_pairs'

  return (
    <div className="lesson">
      <div className="lesson-top">
        <button className="iconbtn" aria-label="Quitter la leçon" onClick={onQuit}><IconClose /></button>
        <div className="progress"><i style={{ width: `${progress}%` }} /></div>
        <div className="hearts" aria-label={`${hearts} cœurs`}>
          <IconHeart filled />
          <span>{hearts}</span>
        </div>
      </div>

      <div className="lesson-body">
        <ExerciseRenderer ex={ex} value={answer} onChange={setAnswer} locked={checked} />
      </div>

      <div className={'footer' + (checked ? (correct ? ' footer--correct' : ' footer--wrong') : '')}>
        {checked && (
          <div className="feedback">
            {correct ? (
              <strong>Zuzena! · Correct</strong>
            ) : (
              <span>
                <strong>Presque…</strong> réponse : <span lang="eu">{solutionText(ex)}</span>
              </span>
            )}
          </div>
        )}

        {!checked ? (
          isMatch ? (
            <div className="footer-hint muted">Associe toutes les paires pour continuer.</div>
          ) : (
            <button className="btn btn--check" disabled={!ready} onClick={handleCheck}>Vérifier</button>
          )
        ) : (
          <button className={'btn ' + (correct ? 'btn--primary' : 'btn--danger')} onClick={handleContinue}>Continuer</button>
        )}
      </div>
    </div>
  )
}

// Texte de la bonne réponse, pour le feedback.
function solutionText(ex) {
  const p = ex.payload || {}
  switch (ex.type) {
    case 'mcq_word':
      return (p.options.find((o) => o.correct) || {}).text
    case 'free_translation':
    case 'fill_blank':
      return (p.accepted || [])[0]
    case 'word_bank':
      return (p.answer || []).join(' ')
    default:
      return ''
  }
}
