// Banque d'exercices = exercices générés depuis le lexique + exercices écrits
// à la main. Un exercice ne « sait » pas dans quelle leçon il vit : il porte
// juste des tags, et les leçons piochent dedans via le moteur de sélection.
import { numbers } from './lexicon'
import { customExercises } from './customExercises'

const rand = (n) => Math.floor(Math.random() * n)

function shuffleInPlace(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample(arr, n, exclude) {
  const copy = arr.filter((x) => x !== exclude)
  const out = []
  while (out.length < n && copy.length) out.push(copy.splice(rand(copy.length), 1)[0])
  return out
}

function tagsFor(w) {
  const t = ['chiffres', w.range]
  if (w.range === '0-4' || w.range === '5-9') t.push('0-9')
  return t
}

function buildFromLexicon(lex) {
  const out = []
  for (const w of lex) {
    const tags = tagsFor(w)

    // Carte "nouveau mot" (intro)
    out.push({
      id: `nw-${w.eu}`,
      type: 'new_word_card',
      tags: [...tags, 'intro'],
      payload: { fr: w.fr, eu: w.eu, hint: `le chiffre ${w.value}` }
    })

    // QCM fr -> eu
    out.push({
      id: `mcqfe-${w.eu}`,
      type: 'mcq_word',
      tags,
      payload: {
        prompt: w.fr,
        promptLang: 'fr',
        answerLang: 'eu',
        options: shuffleInPlace([
          { text: w.eu, correct: true },
          ...sample(lex, 3, w).map((d) => ({ text: d.eu, correct: false }))
        ])
      }
    })

    // QCM eu -> fr
    out.push({
      id: `mcqef-${w.eu}`,
      type: 'mcq_word',
      tags,
      payload: {
        prompt: w.eu,
        promptLang: 'eu',
        answerLang: 'fr',
        options: shuffleInPlace([
          { text: w.fr, correct: true },
          ...sample(lex, 3, w).map((d) => ({ text: d.fr, correct: false }))
        ])
      }
    })

    // Traduction libre fr -> eu (au clavier, corrigée avec normalisation)
    out.push({
      id: `ft-${w.eu}`,
      type: 'free_translation',
      tags,
      payload: { prompt: w.fr, promptLang: 'fr', answerLang: 'eu', accepted: [w.eu] }
    })
  }
  return out
}

function buildMatches(lex) {
  const groups = {}
  for (const w of lex) (groups[w.range] = groups[w.range] || []).push(w)
  const out = []
  for (const [range, items] of Object.entries(groups)) {
    const tags = ['chiffres', range]
    if (range === '0-4' || range === '5-9') tags.push('0-9')
    out.push({
      id: `match-${range}`,
      type: 'match_pairs',
      tags,
      payload: { pairs: items.slice(0, 5).map((w) => ({ fr: w.fr, eu: w.eu })) }
    })
  }
  return out
}

export const bank = [...buildFromLexicon(numbers), ...buildMatches(numbers), ...customExercises]
