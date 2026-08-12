// Fond décoratif de l'écran d'accueil : côte basque stylisée en isométrique,
// avec des vagues animées en CSS (translation en boucle, sans JS). Couleurs
// pilotées par variables CSS (voir index.css) pour s'adapter au dark mode.
// L'animation respecte prefers-reduced-motion via la règle globale existante.
export default function Coastline() {
  return (
    <div className="coastline-bg" aria-hidden="true">
      <svg className="coastline-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice">
        <rect x="0" y="0" width="400" height="300" fill="var(--coast-sky)" />

        {/* falaises isométriques, deux plans pour la profondeur */}
        <polygon points="0,80 130,40 260,80 130,120" fill="var(--coast-cliff-1)" />
        <polygon points="0,80 0,150 130,190 130,120" fill="var(--coast-cliff-1-side)" />
        <polygon points="130,120 260,80 400,120 400,190 260,150 130,190" fill="var(--coast-cliff-2)" />

        {/* mer : deux bandes de vagues qui défilent en parallaxe */}
        <rect x="0" y="150" width="400" height="150" fill="var(--coast-sea-1)" />
        <g className="coastline-wave coastline-wave--back">
          <path d="M0,170 Q25,160 50,170 T100,170 T150,170 T200,170 T250,170 T300,170 T350,170 T400,170 L400,300 L0,300 Z" fill="var(--coast-sea-2)" />
          <path d="M400,170 Q425,160 450,170 T500,170 T550,170 T600,170 T650,170 T700,170 T750,170 T800,170 L800,300 L400,300 Z" fill="var(--coast-sea-2)" />
        </g>
        <g className="coastline-wave coastline-wave--front">
          <path d="M0,200 Q20,190 40,200 T80,200 T120,200 T160,200 T200,200 T240,200 T280,200 T320,200 T360,200 T400,200 L400,300 L0,300 Z" fill="var(--coast-sea-3)" />
          <path d="M400,200 Q420,190 440,200 T480,200 T520,200 T560,200 T600,200 T640,200 T680,200 T720,200 T760,200 T800,200 L800,300 L400,300 Z" fill="var(--coast-sea-3)" />
        </g>
      </svg>
    </div>
  )
}
