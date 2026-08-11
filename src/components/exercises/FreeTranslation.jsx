// Traduction libre au clavier. Correction tolérante (casse / accents / espaces).
export default function FreeTranslation({ ex, value, onChange, locked }) {
  const { prompt, promptLang, answerLang } = ex.payload
  return (
    <div className="ex">
      <div className="ex-title">Écris la traduction</div>
      <div className="ex-prompt" lang={promptLang}>{prompt}</div>
      <input
        className="input"
        type="text"
        lang={answerLang}
        autoFocus
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Ta réponse en basque…"
        value={value || ''}
        disabled={locked}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
