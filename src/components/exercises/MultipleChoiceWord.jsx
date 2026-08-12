// QCM : choisir la bonne traduction parmi 4. value = index choisi.
// Validation immédiate au clic (pas de bouton "Vérifier") : une fois
// verrouillé, l'option choisie se colore selon `correct`, et la bonne
// réponse se met en évidence si l'utilisateur s'est trompé.
export default function MultipleChoiceWord({ ex, value, onChange, locked, checked, correct }) {
  const { prompt, options, promptLang } = ex.payload
  return (
    <div className="ex">
      <div className="ex-title">Choisis la bonne traduction</div>
      <div className="ex-prompt" lang={promptLang}>{prompt}</div>
      <div className="options">
        {options.map((opt, i) => {
          const isSelected = value === i
          let stateClass = ''
          if (checked) {
            if (isSelected) stateClass = correct ? ' option--correct' : ' option--wrong'
            else if (opt.correct) stateClass = ' option--correct'
          } else if (isSelected) {
            stateClass = ' option--selected'
          }
          return (
            <button
              key={i}
              type="button"
              className={'option' + stateClass}
              disabled={locked}
              onClick={() => onChange(i)}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
