// Popup plein écran listant des éléments cliquables (chapitres, ou unités
// d'un chapitre) — voir Path.jsx, qui l'ouvre au clic sur un bandeau
// chapitre/unité. `items` : [{ id, title, titleEu?, color, locked? }].
function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function IconLock() {
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#fff" strokeWidth="2" fill="none" /><rect x="4" y="10" width="16" height="10" rx="2" fill="#fff" /></svg>
}

export default function NavPicker({ title, items, onSelect, onClose, closing }) {
  return (
    <div className={'picker-overlay' + (closing ? ' picker-overlay--closing' : '')}>
      <div className="picker-top">
        <button type="button" className="iconbtn" aria-label="Fermer" onClick={onClose}><IconClose /></button>
        <div className="picker-top-title">{title}</div>
      </div>

      <div className="picker-list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={'picker-item' + (item.locked ? ' picker-item--locked' : '')}
            style={{ background: item.color }}
            onClick={() => onSelect(item.id)}
          >
            <div className="picker-item-title">
              {item.locked && <IconLock />}
              {item.title}
            </div>
            {item.titleEu && <div className="picker-item-sub" lang="eu">{item.titleEu}</div>}
          </button>
        ))}
      </div>
    </div>
  )
}
