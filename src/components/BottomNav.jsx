// Barre de navigation basse : uniquement visuelle pour l'instant (seul l'écran
// "Accueil" existe réellement). Les autres onglets sont désactivés.
function IconHome() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconDumbbell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10v4M6 8v8M18 8v8M21 10v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
function IconChest() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="9" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.2" />
      <path d="M4 13h16M12 9V6a2 2 0 1 1 4 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
function IconProfile() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M5 20c1.4-3.8 4.2-5.8 7-5.8s5.6 2 7 5.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Navigation (aperçu)">
      <button type="button" className="bottomnav-item bottomnav-item--active" aria-current="page">
        <IconHome />
        <span>Accueil</span>
      </button>
      <button type="button" className="bottomnav-item" disabled title="Bientôt disponible">
        <IconDumbbell />
        <span>Entraîner</span>
      </button>
      <button type="button" className="bottomnav-item" disabled title="Bientôt disponible">
        <IconChest />
        <span>Défis</span>
      </button>
      <button type="button" className="bottomnav-item" disabled title="Bientôt disponible">
        <IconProfile />
        <span>Profil</span>
      </button>
    </nav>
  )
}
