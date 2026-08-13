// Résout une leçon (src/data/lessons/<id>.json) en une liste concrète
// d'exercices. Une leçon ne contient pas d'exercices en dur : elle décrit une
// liste d'« appels » (calls), chacun avec un `kind` :
//   - "vocab" (implicite, pas de `kind`) : un exercice paramétré, décrit par
//     `type` (le type d'exercice, voir src/components/exercises/README.md)
//     et `groups` (src/data/groups/<id>.json). Une ligne = un archétype, pas
//     un lot : `resolveLesson` pioche `count` fois au hasard parmi les lignes
//     de `calls` et génère, à chaque pioche, UN exercice concret (mot/paire/
//     phrase tirés au hasard dans les groupes). Avec moins de lignes que
//     `count`, certaines lignes sont donc piochées plusieurs fois.
//   - "literal"                : un exercice écrit à la main, tel quel.
//   - "generated_number_range" : délègue au générateur algorithmique de
//                               nombres (grandes plages, non énumérables).
import { lessonsById } from '../data/lessons'
import { groupsById } from '../data/groups'
import { generateNumberExercises } from './numberExercises'

const rand = (n) => Math.floor(Math.random() * n)
const pick = (arr) => arr[rand(arr.length)]

function shuffleInPlace(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Échantillonne `n` éléments distincts de `arr`, en excluant `exclude`.
function sample(arr, n, exclude) {
  const copy = arr.filter((x) => x !== exclude)
  const out = []
  while (out.length < n && copy.length) out.push(copy.splice(rand(copy.length), 1)[0])
  return out
}

let uidCounter = 0
const uid = () => (uidCounter++).toString(36)

const wordOf = (item, lang) => (lang === 'fr' ? item.fr : item.eu)
const CONJ = { fr: 'et', eu: 'eta' }

// Construit UN exercice concret d'un `type` donné à partir d'une liste
// d'items {fr, eu, value}. Pioche au hasard dans `items` à chaque appel — le
// même appel produit un exercice différent à chaque pioche.
function buildOneVocabExercise(type, items) {
  switch (type) {
    case 'new_word_card': {
      const w = pick(items)
      return { id: `nw-${w.eu}-${uid()}`, type, tags: ['intro'], payload: { fr: w.fr, eu: w.eu } }
    }

    case 'mcq_word': {
      const w = pick(items)
      const reverse = Math.random() < 0.5
      const promptLang = reverse ? 'eu' : 'fr'
      const answerLang = reverse ? 'fr' : 'eu'
      const options = [
        { text: wordOf(w, answerLang), correct: true },
        ...sample(items, 3, w).map((d) => ({ text: wordOf(d, answerLang), correct: false })),
      ]
      return {
        id: `mcq-${w.eu}-${uid()}`,
        type,
        tags: [],
        payload: { prompt: wordOf(w, promptLang), promptLang, answerLang, options: shuffleInPlace(options) },
      }
    }

    case 'free_translation': {
      const w = pick(items)
      const reverse = Math.random() < 0.5
      const promptLang = reverse ? 'eu' : 'fr'
      const answerLang = reverse ? 'fr' : 'eu'
      return {
        id: `ft-${w.eu}-${uid()}`,
        type,
        tags: [],
        payload: { prompt: wordOf(w, promptLang), promptLang, answerLang, accepted: [wordOf(w, answerLang)] },
      }
    }

    case 'match_pairs': {
      const pairCount = Math.min(5, items.length)
      if (pairCount < 2) return null
      const pairs = sample(items, pairCount).map((w) => ({ fr: w.fr, eu: w.eu }))
      return { id: `match-${uid()}`, type, tags: [], payload: { pairs } }
    }

    // "A et B" -> "a eta b" (ou l'inverse) : phrase à reconstituer avec des
    // blocs de mots. `eta`/`et` sont les seuls connecteurs de la leçon des
    // nombres, d'où le hardcode ici plutôt que dans les groupes de contenu.
    case 'word_bank': {
      if (items.length < 2) return null
      const [a, b] = sample(items, 2)
      const reverse = Math.random() < 0.5
      const promptLang = reverse ? 'eu' : 'fr'
      const answerLang = reverse ? 'fr' : 'eu'
      const distractors = sample(items, Math.min(2, items.length - 2), a)
        .filter((w) => w !== b)
        .map((w) => wordOf(w, answerLang))
      return {
        id: `wb-${uid()}`,
        type,
        tags: [],
        payload: {
          promptLang,
          answerLang,
          prompt: `${wordOf(a, promptLang)} ${CONJ[promptLang]} ${wordOf(b, promptLang)}`,
          answer: [wordOf(a, answerLang), CONJ[answerLang], wordOf(b, answerLang)],
          distractors,
        },
      }
    }

    // Suite à trous : trois items consécutifs DANS L'ORDRE DU GROUPE (pas
    // forcément valeur ±1 — permet un groupe de dizaines type 20/30/40…).
    case 'fill_blank': {
      if (items.length < 3) return null
      const sorted = [...items].sort((x, y) => x.value - y.value)
      const i = 1 + rand(sorted.length - 2)
      return {
        id: `fb-${uid()}`,
        type,
        tags: [],
        payload: {
          prompt: 'Complète la suite',
          text: `${sorted[i - 1].eu}, ___, ${sorted[i + 1].eu}`,
          accepted: [sorted[i].eu],
        },
      }
    }

    default:
      return null
  }
}

// Résout une ligne de `calls` en UN exercice (ou null si elle ne peut pas en
// produire un, ex. groupe trop court pour fill_blank/match_pairs).
function resolveCall(call) {
  if (call.kind === 'literal') {
    return { id: `lit-${uid()}`, type: call.type, tags: call.tags || [], payload: call.payload }
  }
  const items = (call.groups || []).flatMap((id) => groupsById[id]?.items || [])
  if (!items.length) return null
  return buildOneVocabExercise(call.type, items)
}

export function resolveLesson(lessonId) {
  const lesson = lessonsById[lessonId]
  if (!lesson || !lesson.calls?.length) return []
  const count = lesson.count ?? 10

  if (lesson.calls.length === 1 && lesson.calls[0].kind === 'generated_number_range') {
    const { min, max } = lesson.calls[0]
    return generateNumberExercises({ min, max, count })
  }

  // Pioche `count` fois au hasard parmi les lignes de `calls`, une leçon
  // avec 7 lignes et count=10 en repioche donc certaines. Garde-fou anti
  // boucle infinie si toutes les lignes échouent (groupes trop courts).
  const result = []
  for (let tries = 0; result.length < count && tries < count * 20; tries++) {
    const ex = resolveCall(pick(lesson.calls))
    if (ex) result.push(ex)
  }

  // Confort : les cartes "nouveau mot" passent en tête de leçon.
  const intros = result.filter((e) => e.type === 'new_word_card')
  const others = result.filter((e) => e.type !== 'new_word_card')
  return [...intros, ...others]
}
