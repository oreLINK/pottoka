// Génère à la volée des exercices de traduction sur des nombres tirés au
// hasard dans une plage donnée (utilisé pour les leçons "10 à 50", "50 à
// 100", "100 à 1000", "1000 à 1 000 000" — trop de nombres possibles pour
// une banque précalculée). La consigne affiche le nombre en chiffres (pas en
// mots français) : voir toBasque() pour la traduction basque.
import { toBasque } from './basqueNumbers'

const fmt = new Intl.NumberFormat('fr-FR')
const rand = (n) => Math.floor(Math.random() * n)

function shuffleInPlace(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Tire `count` entiers distincts dans [min, max], en excluant `exclude`.
function sampleDistinctInts(min, max, count, exclude) {
  const span = max - min + 1
  const avoid = exclude == null ? -1 : exclude
  const out = new Set()
  const target = Math.min(count, avoid >= min && avoid <= max ? span - 1 : span)
  while (out.size < target) {
    const n = min + rand(span)
    if (n !== avoid) out.add(n)
  }
  return [...out]
}

export function generateNumberExercises({ min, max, count = 10 }) {
  const values = sampleDistinctInts(min, max, count)
  return values.map((n) => {
    const uid = Math.random().toString(36).slice(2, 7)
    const promptDigits = fmt.format(n)

    if (Math.random() < 0.5) {
      const distractors = sampleDistinctInts(min, max, 3, n)
      const options = shuffleInPlace([
        { text: toBasque(n), correct: true },
        ...distractors.map((d) => ({ text: toBasque(d), correct: false }))
      ])
      return {
        id: `gen-mcq-${n}-${uid}`,
        type: 'mcq_word',
        tags: ['chiffres', 'generated'],
        payload: { prompt: promptDigits, promptLang: 'fr', answerLang: 'eu', options }
      }
    }

    return {
      id: `gen-ft-${n}-${uid}`,
      type: 'free_translation',
      tags: ['chiffres', 'generated'],
      payload: { prompt: promptDigits, promptLang: 'fr', answerLang: 'eu', accepted: [toBasque(n)] }
    }
  })
}
