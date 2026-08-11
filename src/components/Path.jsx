import { useEffect, useState } from 'react'
import Pottoka from './Pottoka'
import BottomNav from './BottomNav'
import { lessonStatus } from '../engine/progress'

function IconCheck() {
  return <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function IconLock() {
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#9a9a9a" strokeWidth="2" fill="none" /><rect x="4" y="10" width="16" height="10" rx="2" fill="#c9c9c9" /></svg>
}
function IconStar() {
  return <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 22l1-6L3.3 9.4l6-.9z" fill="#fff" /></svg>
}
function IconBook() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z" fill="#fff" opacity="0.9" />
      <path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" fill="#fff" opacity="0.65" />
    </svg>
  )
}
function IconFlagEu() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" role="img" aria-label="Euskara">
      <rect width="22" height="16" rx="2" fill="#D8232A" />
      <path d="M0 0L22 16M22 0L0 16" stroke="#3AA655" strokeWidth="3.5" />
      <path d="M11 0V16M0 8H22" stroke="#fff" strokeWidth="3" />
    </svg>
  )
}

// Le "chemin" d'apprentissage : chapitres -> unités -> leçons en pastilles.
export default function Path({ course, progress, onStart, onReset }) {
  const [openLessonId, setOpenLessonId] = useState(null)

  // Ferme le popup au clic en dehors du nœud (ou de son popup) ouvert.
  useEffect(() => {
    if (!openLessonId) return
    function handleClickOutside(e) {
      const wrap = e.target.closest('.node-wrap')
      if (!wrap || wrap.dataset.lessonId !== openLessonId) setOpenLessonId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openLessonId])

  return (
    <div className="home">
      <header className="topbar">
        <div className="brand">
          <Pottoka expression="wave" size={40} />
          <span>Pottoka</span>
        </div>
        <div className="stats">
          <div className="stat stat--lang" title="Euskara"><IconFlagEu /></div>
          <div className="stat stat--fire" title="Série">🔥 {progress.streak}</div>
          <div className="stat stat--xp" title="XP">✦ {progress.xp}</div>
        </div>
      </header>

      {course.chapters.map((ch) => (
        <section key={ch.id} className={'chapter' + (ch.locked ? ' chapter--locked' : '')}>
          <div className="chapter-head" style={{ background: ch.color, boxShadow: `0 4px 0 ${shade(ch.color)}` }}>
            <div className="chapter-score">{ch.score}</div>
            <div className="chapter-title">{ch.title}</div>
          </div>

          {(ch.units || []).map((unit) => (
            <div key={unit.id} className="unit">
              <div className="unit-banner" style={{ background: tint(unit.color || ch.color) }}>
                <div className="unit-banner-text">
                  <div className="unit-title">{unit.title}</div>
                  {unit.subtitle && <div className="unit-sub">{unit.subtitle}</div>}
                </div>
                <IconBook />
              </div>

              <div className="path">
                {(unit.lessons || []).map((lesson, idx) => {
                  const status = ch.locked ? 'locked' : lessonStatus(progress, course, lesson.id)
                  const crowns = progress.lessons[lesson.id]?.crowns || 0
                  const offset = pathOffset(idx)
                  const nodeStyle =
                    status === 'available'
                      ? { background: ch.color, boxShadow: `0 6px 0 ${shade(ch.color)}`, '--pulse-color': ch.color }
                      : status === 'done'
                      ? { background: ch.color, boxShadow: `0 3px 0 ${shade(ch.color)}` }
                      : undefined
                  const isOpen = openLessonId === lesson.id
                  return (
                    <div
                      key={lesson.id}
                      className={'node-wrap' + (isOpen ? ' node-wrap--open' : '')}
                      data-lesson-id={lesson.id}
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <button
                        type="button"
                        className={`node node--${status}`}
                        style={nodeStyle}
                        disabled={status === 'locked'}
                        onClick={() => setOpenLessonId((id) => (id === lesson.id ? null : lesson.id))}
                        aria-label={`${lesson.title} — ${status}`}
                      >
                        {status === 'done' ? <IconCheck /> : status === 'locked' ? <IconLock /> : <IconStar />}
                        {status === 'done' && crowns > 0 && <span className="node-crown-badge">👑{crowns}</span>}
                      </button>

                      {status === 'available' && (
                        <div className={`path-mascot path-mascot--${offset >= 0 ? 'left' : 'right'}`}>
                          <div className="mascot-bubble" style={{ borderColor: ch.color, color: ch.color }}>Démarrer</div>
                          <Pottoka expression="cheer" size={60} />
                        </div>
                      )}

                      {isOpen && (
                        <div className="lesson-popup">
                          <div className="lesson-popup-title">{lesson.title}</div>
                          {lesson.description && <div className="lesson-popup-desc">{lesson.description}</div>}
                          <button
                            type="button"
                            className="btn btn--primary"
                            style={{ background: ch.color, boxShadow: `0 4px 0 ${shade(ch.color)}` }}
                            onClick={() => { setOpenLessonId(null); onStart(lesson) }}
                          >
                            {status === 'done' ? 'Réviser' : 'Commencer'}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      ))}

      <footer className="home-footer">
        <button className="btn btn--ghost btn--sm" onClick={onReset}>Réinitialiser ma progression</button>
      </footer>

      <BottomNav />
    </div>
  )
}

// Décalage horizontal (px) du n-ième nœud du chemin, façon zigzag Duolingo.
// Onde sinusoïdale discrète de période 8 : reproduit le motif classique
// (0, 40, 56, 40, 0, -40, -56, -40…) mais scalable à un nombre de leçons
// quelconque, sans dépendre de règles CSS nth-child figées.
function pathOffset(index, amplitude = 56) {
  return Math.round(Math.sin((index * Math.PI) / 4) * amplitude)
}

// Assombrit une couleur hex pour l'effet 3D des boutons.
function shade(hex) {
  const c = hex.replace('#', '')
  const n = parseInt(c, 16)
  const r = Math.max(0, ((n >> 16) & 255) - 40)
  const g = Math.max(0, ((n >> 8) & 255) - 40)
  const b = Math.max(0, (n & 255) - 40)
  return `rgb(${r},${g},${b})`
}

// Éclaircit une couleur hex en la mélangeant avec du blanc, pour la bannière
// d'unité (évite qu'elle soit identique à l'en-tête du chapitre au-dessus).
function tint(hex, amount = 0.32) {
  const c = hex.replace('#', '')
  const n = parseInt(c, 16)
  const mix = (v) => Math.round(v + (255 - v) * amount)
  const r = mix((n >> 16) & 255)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `rgb(${r},${g},${b})`
}
