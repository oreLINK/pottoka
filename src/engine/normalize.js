// Normalisation des réponses libres : casse, accents, espaces, ponctuation.
// NOTE basque : NFD + retrait des diacritiques transforme aussi "ñ" -> "n" et
// "ü" -> "u". C'est une TOLÉRANCE de saisie (l'utilisateur francophone tape "n").
// L'orthographe correcte (ñ, ü) reste stockée et affichée telle quelle ;
// on ne normalise QUE pour comparer.
export function normalize(input) {
  return (input ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // retire les accents / diacritiques
    .replace(/[^\p{L}\p{N}\s]/gu, '') // retire la ponctuation
    .replace(/\s+/g, ' ') // espaces multiples -> un seul
}

// Compare deux séquences de mots (ordre significatif) après normalisation.
export function tokensEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  return a.map(normalize).join('|') === b.map(normalize).join('|')
}
