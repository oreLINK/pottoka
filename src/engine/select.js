// Moteur de sélection des exercices d'une leçon.
// La leçon ne contient PAS d'exercices en dur : elle décrit COMMENT en choisir
// dans la banque. Modes : "random" | "ordered" | "all", combinables avec
// filter (par tags), whitelist (toujours inclus) et blacklist (jamais inclus).

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function matchesFilter(ex, filter) {
  if (!filter) return true
  const tags = ex.tags || []
  if (filter.anyTag && !filter.anyTag.some((t) => tags.includes(t))) return false
  if (filter.allTag && !filter.allTag.every((t) => tags.includes(t))) return false
  if (filter.type && ex.type !== filter.type) return false
  return true
}

export function resolveLesson(lesson, bank) {
  const byId = Object.fromEntries(bank.map((e) => [e.id, e]))
  const sel = lesson.selection || {}
  const count = lesson.count ?? 10

  // 1) point de départ : orderlist (si ordered) sinon la banque filtrée par tags
  let pool
  if (sel.mode === 'ordered' && Array.isArray(sel.orderlist)) {
    pool = sel.orderlist.map((id) => byId[id]).filter(Boolean)
  } else {
    pool = bank.filter((e) => matchesFilter(e, sel.filter))
  }

  // 2) retirer la blacklist
  const black = new Set(sel.blacklist || [])
  pool = pool.filter((e) => !black.has(e.id))

  // 3) forcer la whitelist (toujours incluse, en tête)
  const forced = (sel.whitelist || []).map((id) => byId[id]).filter(Boolean)
  const forcedIds = new Set(forced.map((e) => e.id))
  let rest = pool.filter((e) => !forcedIds.has(e.id))

  // 4) random -> on mélange ; ordered -> on garde l'ordre
  if (sel.mode !== 'ordered') rest = shuffle(rest)

  // 5) tronquer / compléter à count (sauf mode "all")
  let result = [...forced, ...rest]
  if (sel.mode !== 'all') result = result.slice(0, count)

  // Confort : les cartes "nouveau mot" passent en tête de leçon.
  const intros = result.filter((e) => e.type === 'new_word_card')
  const others = result.filter((e) => e.type !== 'new_word_card')
  return [...intros, ...others]
}
