// Résout une leçon (src/data/lessons/<id>.json) en une liste concrète
// d'exercices. Une leçon ne contient pas d'exercices en dur : elle décrit une
// liste d'« appels » (calls), chacun avec un `kind` :
//   - "vocab"                 : construit des exercices depuis des groupes de
//                               contenu (src/data/groups/<id>.json) + les
//                               types d'exercices demandés.
//   - "literal"                : un exercice écrit à la main, tel quel.
//   - "generated_number_range" : délègue au générateur algorithmique de
//                               nombres (grandes plages, non énumérables).
import { lessonsById } from '../data/lessons'
import { groupsById } from '../data/groups'
import { generateNumberExercises } from './numberExercises'

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

let uidCounter = 0
const uid = () => (uidCounter++).toString(36)

// Construit les exercices demandés (exerciseTypes) à partir d'une liste de
// paires {fr, eu}. Les distracteurs de QCM sont échantillonnés dans `items`.
function buildVocabExercises(items, exerciseTypes, pairCount) {
  const out = []
  for (const type of exerciseTypes) {
    if (type === 'match_pairs') {
      out.push({
        id: `match-${uid()}`,
        type: 'match_pairs',
        tags: [],
        payload: { pairs: items.slice(0, pairCount || 5).map((w) => ({ fr: w.fr, eu: w.eu })) }
      })
      continue
    }
    for (const w of items) {
      if (type === 'new_word_card') {
        out.push({ id: `nw-${w.eu}-${uid()}`, type, tags: ['intro'], payload: { fr: w.fr, eu: w.eu } })
      } else if (type === 'mcq_word') {
        out.push({
          id: `mcqfe-${w.eu}-${uid()}`,
          type,
          tags: [],
          payload: {
            prompt: w.fr,
            promptLang: 'fr',
            answerLang: 'eu',
            options: shuffleInPlace([{ text: w.eu, correct: true }, ...sample(items, 3, w).map((d) => ({ text: d.eu, correct: false }))])
          }
        })
        out.push({
          id: `mcqef-${w.eu}-${uid()}`,
          type,
          tags: [],
          payload: {
            prompt: w.eu,
            promptLang: 'eu',
            answerLang: 'fr',
            options: shuffleInPlace([{ text: w.fr, correct: true }, ...sample(items, 3, w).map((d) => ({ text: d.fr, correct: false }))])
          }
        })
      } else if (type === 'free_translation') {
        out.push({ id: `ft-${w.eu}-${uid()}`, type, tags: [], payload: { prompt: w.fr, promptLang: 'fr', answerLang: 'eu', accepted: [w.eu] } })
      }
    }
  }
  return out
}

function resolveCall(call, count) {
  switch (call.kind) {
    case 'vocab': {
      const items = call.groups.flatMap((id) => groupsById[id]?.items || [])
      return buildVocabExercises(items, call.exerciseTypes, call.pairCount)
    }
    case 'literal':
      return [{ id: `lit-${uid()}`, type: call.type, tags: call.tags || [], payload: call.payload }]
    case 'generated_number_range':
      return generateNumberExercises({ min: call.min, max: call.max, count })
    default:
      return []
  }
}

export function resolveLesson(lessonId) {
  const lesson = lessonsById[lessonId]
  if (!lesson || !lesson.calls?.length) return []
  const count = lesson.count ?? 10

  if (lesson.calls.length === 1 && lesson.calls[0].kind === 'generated_number_range') {
    return resolveCall(lesson.calls[0], count)
  }

  const pool = shuffleInPlace(lesson.calls.flatMap((call) => resolveCall(call, count)))
  const result = pool.slice(0, count)

  // Confort : les cartes "nouveau mot" passent en tête de leçon.
  const intros = result.filter((e) => e.type === 'new_word_card')
  const others = result.filter((e) => e.type !== 'new_word_card')
  return [...intros, ...others]
}
