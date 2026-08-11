// QCM : choisir la bonne traduction parmi 4. value = index choisi.
export default function MultipleChoiceWord({ ex, value, onChange, locked }) {
  const { prompt, options, promptLang } = ex.payload
  return (
    <div className="ex">
      <div className="ex-title">Choisis la bonne traduction</div>
      <div className="ex-prompt" lang={promptLang}>{prompt}</div>
      <div className="options">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={'option' + (value === i ? ' option--selected' : '')}
            disabled={locked}
            onClick={() => onChange(i)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  )
}
