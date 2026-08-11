// Carte d'introduction d'un nouveau mot (pas de saisie, juste "Continuer").
export default function NewWordCard({ ex }) {
  const { fr, eu, hint } = ex.payload
  return (
    <div className="ex ex--center">
      <div className="ex-kicker">Nouveau mot</div>
      <div className="newword">
        <div className="newword-eu" lang="eu">{eu}</div>
        <div className="newword-fr">{fr}{hint ? ` · ${hint}` : ''}</div>
      </div>
    </div>
  )
}
