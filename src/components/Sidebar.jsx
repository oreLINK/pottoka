import Pottoka from './Pottoka'

// Barre latérale desktop (≥900px, voir index.css) : table des matières du
// parcours (chapitres -> unités), ancrée sur les mêmes ids que les <section>/
// <div> de Path.jsx. Masquée en CSS sur mobile. Toujours montée (même
// pendant une leçon/un cours) : `onNavigate` fait quitter l'écran actif puis
// scrolle jusqu'à l'ancre une fois revenu sur l'accueil (voir App.jsx) — le
// `href` reste posé pour le clic milieu / la navigation clavier.
export default function Sidebar({ tree, onNavigate }) {
  const chapters = tree.chapters.filter((ch) => ch.isDisplay)

  function link(id, e) {
    e.preventDefault()
    onNavigate(id)
  }

  return (
    <aside className="sidebar">
      <a href="#top" className="sidebar-brand" onClick={(e) => link('top', e)}>
        <Pottoka expression="wave" size={22} />
        <span>Pottoka</span>
      </a>

      <nav>
        {chapters.map((ch) => (
          <div key={ch.id} className="sidebar-chapter">
            <a href={`#${ch.id}`} className="sidebar-chapter-title" onClick={(e) => link(ch.id, e)}>{ch.title}</a>
            {(ch.units || []).filter((unit) => unit.isDisplay).map((unit) => (
              <a key={unit.id} href={`#${unit.id}`} className="sidebar-link" onClick={(e) => link(unit.id, e)}>{unit.title}</a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
