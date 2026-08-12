import { useEffect, useState } from 'react'
import Pottoka from './Pottoka'
import Coastline from './Coastline'
import { resolvePathItem } from '../data/pathItems'

function IconLock() {
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#9a9a9a" strokeWidth="2" fill="none" /><rect x="4" y="10" width="16" height="10" rx="2" fill="#c9c9c9" /></svg>
}
function IconStar() {
  return <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 22l1-6L3.3 9.4l6-.9z" fill="#fff" /></svg>
}
function IconBook({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5Z" fill="#fff" opacity="0.9" />
      <path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" fill="#fff" opacity="0.65" />
    </svg>
  )
}

// Le "chemin" d'apprentissage : chapitres -> unités -> parcours en zigzag de
// pastilles (leçons ou cours, voir src/data/pathItems.js), titre visible
// sous chaque pastille. `tree` ne décrit que la navigation (voir
// src/data/tree.json) ; le titre et la description de chaque élément
// viennent de src/data/lessons/<id>.json ou src/data/courses/<id>.json.
export default function Path({ tree, onStart }) {
  const [openId, setOpenId] = useState(null)

  // Ferme le popup au clic en dehors du nœud (ou de son popup) ouvert.
  useEffect(() => {
    if (!openId) return
    function handleClickOutside(e) {
      const wrap = e.target.closest('.node-wrap')
      if (!wrap || wrap.dataset.itemId !== openId) setOpenId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openId])

  return (
    <div className="home">
      <Coastline />
      <header className="topbar">
        <div className="brand">
          <Pottoka expression="wave" size={20} />
          <span>Pottoka</span>
        </div>
      </header>

      {tree.chapters.filter((ch) => ch.isDisplay).map((ch) => (
        <section key={ch.id} className={'chapter' + (ch.locked ? ' chapter--locked' : '')}>
          <div className="chapter-head" style={{ background: ch.color, boxShadow: `0 4px 0 ${shade(ch.color)}` }}>
            <div className="chapter-title">{ch.title}</div>
            {ch.titleEu && <div className="chapter-subtitle" lang="eu">{ch.titleEu}</div>}
          </div>

          {(ch.units || []).filter((unit) => unit.isDisplay).map((unit) => (
            <div key={unit.id} className="unit">
              <div className="unit-banner" style={{ background: tint(unit.color || ch.color) }}>
                <div className="unit-banner-text">
                  <div className="unit-title">{unit.title}</div>
                  {unit.titleEu && <div className="unit-sub" lang="eu">{unit.titleEu}</div>}
                </div>
                <IconBook />
              </div>

              <div className="path">
                {(unit.lessons || []).map((rawId, idx) => {
                  const item = resolvePathItem(rawId)
                  if (!item) return null
                  const isCourse = item.kind === 'course'
                  const locked = !!ch.locked
                  const offset = pathOffset(idx)
                  const nodeStyle = !locked && !isCourse
                    ? { background: ch.color, boxShadow: `0 4px 0 ${shade(ch.color)}` }
                    : undefined
                  const isOpen = openId === rawId
                  return (
                    <div
                      key={rawId}
                      className="node-wrap"
                      data-item-id={rawId}
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <button
                        type="button"
                        className={'node' + (locked ? ' node--locked' : '') + (isCourse ? ' node--course' : '')}
                        style={nodeStyle}
                        disabled={locked}
                        onClick={() => setOpenId((id) => (id === rawId ? null : rawId))}
                        aria-label={locked ? `${item.data.title} — verrouillé` : item.data.title}
                      >
                        {locked ? <IconLock /> : isCourse ? <IconBook size={30} /> : <IconStar />}
                      </button>

                      {isOpen && (
                        <div className="node-popup">
                          <div className="node-popup-title">{item.data.title}</div>
                          {item.data.description && <div className="node-popup-desc">{item.data.description}</div>}
                          <button
                            type="button"
                            className="btn btn--primary"
                            style={isCourse
                              ? { background: 'var(--red)', boxShadow: '0 4px 0 var(--red-d)' }
                              : { background: ch.color, boxShadow: `0 4px 0 ${shade(ch.color)}` }}
                            onClick={() => { setOpenId(null); onStart(rawId) }}
                          >
                            Commencer
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

      <div className="path-end muted">À venir…</div>
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
