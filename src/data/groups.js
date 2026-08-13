import { byId } from './registry'

const modules = import.meta.glob('./groups/**/*.json', { eager: true, import: 'default' })
const rawById = byId(modules)

// Un groupe est soit une liste littérale d'items ({ items: [...] }), soit un
// groupe composite qui additionne d'autres groupes ({ groups: [...ids] }) —
// utile pour un groupe "somme" comme numbers-0-100 sans dupliquer le contenu.
function resolveGroup(id, seen) {
  const raw = rawById[id]
  if (!raw) return { items: [] }
  if (raw.groups) {
    if (seen.has(id)) throw new Error(`Cycle de groupes détecté sur "${id}"`)
    seen.add(id)
    return { items: raw.groups.flatMap((groupId) => resolveGroup(groupId, seen).items) }
  }
  return raw
}

export const groupsById = Object.fromEntries(
  Object.keys(rawById).map((id) => [id, resolveGroup(id, new Set())])
)
