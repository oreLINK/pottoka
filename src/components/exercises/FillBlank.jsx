// Texte à trous : le "___" est remplacé par un champ de saisie.
export default function FillBlank({ ex, value, onChange, locked }) {
  const { prompt, text } = ex.payload
  const [before, after] = text.split('___')
  return (
    <div className="ex">
      <div className="ex-title">{prompt || 'Complète'}</div>
      <div className="fillblank" lang="eu">
        <span>{before}</span>
        <input
          className="input input--inline"
          type="text"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={value || ''}
          disabled={locked}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{after}</span>
      </div>
    </div>
  )
}
