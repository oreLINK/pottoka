// Arbre du cours : Chapitre -> Unité -> Leçon. Chaque leçon décrit sa SÉLECTION
// (mode + filtre par tags) plutôt que de lister des exercices. On peut passer
// une leçon en révision ordonnée sans dupliquer un seul exercice :
//   selection: { mode: 'ordered', orderlist: ['nw-hiru', 'mcqfe-hiru', ...] }
export const course = {
  chapters: [
    {
      id: 'ch1',
      title: 'Les bases',
      score: 'Score 1 à 5',
      color: '#3AA655',
      units: [
        {
          id: 'ch1-u1',
          title: 'Les chiffres et les nombres',
          subtitle: 'Compter de 0 à 20',
          color: '#3AA655',
          lessons: [
            { id: 'ch1-u1-l1', title: 'Chiffres 0 à 4', count: 8, xp: 15, selection: { mode: 'random', filter: { anyTag: ['0-4'] } } },
            { id: 'ch1-u1-l2', title: 'Chiffres 5 à 9', count: 8, xp: 15, selection: { mode: 'random', filter: { anyTag: ['5-9'] } } },
            { id: 'ch1-u1-l3', title: 'Révision 0 à 9', count: 10, xp: 20, selection: { mode: 'random', filter: { anyTag: ['0-9'] } } },
            { id: 'ch1-u1-l4', title: 'Nombres 10 à 20', count: 8, xp: 15, selection: { mode: 'random', filter: { anyTag: ['10-20'] } } }
          ]
        }
      ]
    },
    {
      id: 'ch2',
      title: 'Se présenter',
      score: 'Score 6 à 10',
      color: '#1CA0C4',
      locked: true,
      units: [
        { id: 'ch2-u1', title: 'Salutations', subtitle: 'Kaixo, agur…', color: '#1CA0C4', lessons: [{ id: 'ch2-u1-l1', title: 'Kaixo !', count: 6 }] }
      ]
    }
  ]
}
