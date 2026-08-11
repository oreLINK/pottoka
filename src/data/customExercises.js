// Exercices écrits à la main (phrases -> grammaire à valider). Chaque objet suit
// le même format que la banque générée : id, type, tags, payload.
// "eta" = "et". On reste sur des constructions courtes et sûres en V1.
export const customExercises = [
  {
    id: 'wb-1-et-2',
    type: 'word_bank',
    tags: ['chiffres', '0-4', '0-9'],
    payload: {
      promptLang: 'fr',
      answerLang: 'eu',
      prompt: 'un et deux',
      answer: ['bat', 'eta', 'bi'],
      distractors: ['hiru', 'lau']
    }
  },
  {
    id: 'wb-3-et-4',
    type: 'word_bank',
    tags: ['chiffres', '0-4', '0-9'],
    payload: {
      promptLang: 'fr',
      answerLang: 'eu',
      prompt: 'trois et quatre',
      answer: ['hiru', 'eta', 'lau'],
      distractors: ['bost', 'bi', 'zero']
    }
  },
  {
    id: 'wb-eu-6-et-7',
    type: 'word_bank',
    tags: ['chiffres', '5-9', '0-9'],
    payload: {
      promptLang: 'eu',
      answerLang: 'fr',
      prompt: 'sei eta zazpi',
      answer: ['six', 'et', 'sept'],
      distractors: ['cinq', 'huit']
    }
  },
  {
    id: 'fb-seq-3-5',
    type: 'fill_blank',
    tags: ['chiffres', '0-4', '0-9'],
    payload: { prompt: 'Complète la suite', text: 'hiru, ___, bost', accepted: ['lau'] }
  },
  {
    id: 'fb-seq-7-9',
    type: 'fill_blank',
    tags: ['chiffres', '5-9', '0-9'],
    payload: { prompt: 'Complète la suite', text: 'zazpi, ___, bederatzi', accepted: ['zortzi'] }
  },
  {
    id: 'fb-10-12',
    type: 'fill_blank',
    tags: ['chiffres', '10-20'],
    payload: { prompt: 'Complète la suite', text: 'hamar, ___, hamabi', accepted: ['hamaika'] }
  }
]
