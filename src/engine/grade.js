import { normalize, tokensEqual } from './normalize'

// Correction centralisée : chaque type d'exercice renvoie juste / faux à partir
// de la réponse remontée par son composant.
export function grade(ex, answer) {
  const p = ex.payload || {}
  switch (ex.type) {
    case 'new_word_card':
      return true
    case 'mcq_word':
      return answer != null && !!p.options?.[answer]?.correct
    case 'free_translation':
    case 'fill_blank':
      return (p.accepted || []).map(normalize).includes(normalize(answer))
    case 'word_bank':
      return tokensEqual(answer, p.answer)
    case 'match_pairs':
      return answer === 'done'
    default:
      return false
  }
}

// Le bouton "Vérifier" est-il actionnable (une réponse a-t-elle été saisie) ?
// NOTE : au changement d'exercice, un rendu peut survenir avec le nouveau
// type d'exercice mais encore l'ancienne réponse en state (le reset se fait
// dans un effect, donc après ce rendu) — d'où les vérifications de type
// avant d'appeler des méthodes spécifiques à une forme (.trim, tableau...).
export function canCheck(ex, answer) {
  switch (ex.type) {
    case 'new_word_card':
      return true
    case 'mcq_word':
      return typeof answer === 'number'
    case 'free_translation':
    case 'fill_blank':
      return typeof answer === 'string' && !!answer.trim()
    case 'word_bank':
      return Array.isArray(answer) && answer.length > 0
    case 'match_pairs':
      return answer === 'done'
    default:
      return false
  }
}
