import Pottoka from './Pottoka'
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

// Le "chemin" d'apprentissage : chapitres -> unités -> leçons en pastilles.
export default function Path({ course, progress, onStart, onReset }) {
  return (
    <div className="home">
      <header className="topbar">
        <div className="brand">
          <Pottoka expression="wave" size={40} />
          <span>Pottoka</span>
        </div>
        <div className="stats">
          <div className="stat stat--fire" title="Série">🔥 {progress.streak}</div>
          <div className="stat stat--xp" title="XP">✦ {progress.xp}</div>
        </div>
      </header>

      {course.chapters.map((ch) => (
        <section key={ch.id} className={'chapter' + (ch.locked ? ' chapter--locked' : '')}>
          <div className="chapter-head" style={{ background: ch.color }}>
            <div className="chapter-score">{ch.score}</div>
            <div className="chapter-title">{ch.title}</div>
          </div>

          {(ch.units || []).map((unit) => (
            <div key={unit.id} className="unit">
              <div className="unit-head">
                <div className="unit-title">{unit.title}</div>
                {unit.subtitle && <div className="unit-sub">{unit.subtitle}</div>}
              </div>

              <div className="path">
                {(unit.lessons || []).map((lesson) => {
                  const status = ch.locked ? 'locked' : lessonStatus(progress, course, lesson.id)
                  const crowns = progress.lessons[lesson.id]?.crowns || 0
                  return (
                    <div key={lesson.id} className="node-wrap">
                      <button
                        type="button"
                        className={`node node--${status}`}
                        style={status !== 'locked' ? { background: ch.color, boxShadow: `0 5px 0 ${shade(ch.color)}` } : undefined}
                        disabled={status === 'locked'}
                        onClick={() => onStart(lesson)}
                        aria-label={`${lesson.title} — ${status}`}
                      >
                        {status === 'done' ? <IconCheck /> : status === 'locked' ? <IconLock /> : <IconStar />}
                      </button>
                      <div className="node-label">{lesson.title}</div>
                      {status === 'done' && crowns > 0 && <div className="node-crowns">👑 {crowns}</div>}
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
    </div>
  )
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
