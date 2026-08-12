// Résout un id brut de unit.lessons (src/data/tree.json) en un élément de
// parcours typé : une leçon (exercices) ou un cours (lecture). On cherche
// d'abord dans les leçons puis dans les cours — convention : un id de leçon
// se termine en -lN, un id de cours en -cN, pour ne jamais entrer en
// collision entre les deux registres.
import { lessonsById } from './lessons'
import { coursesById } from './courses'

export function resolvePathItem(id) {
  if (lessonsById[id]) return { kind: 'lesson', id, data: lessonsById[id] }
  if (coursesById[id]) return { kind: 'course', id, data: coursesById[id] }
  return null
}
