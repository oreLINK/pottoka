// Progression persistée dans le navigateur (localStorage). Gamification allégée :
// XP, série (streak) journalière, et statut par leçon (déverrouillage en cascade).
const KEY = 'pottoka:progress:v1'

const dayStr = (d = new Date()) => d.toISOString().slice(0, 10)

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* stockage indisponible : on repart d'un état vierge */
  }
  return { xp: 0, streak: 0, lastDay: null, lessons: {} }
}

export function saveProgress(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch (e) {
    /* ignore */
  }
}

export function completeLesson(p, lessonId, gainedXp) {
  const next = { ...p, lessons: { ...p.lessons } }
  const cur = next.lessons[lessonId] || { crowns: 0 }
  next.lessons[lessonId] = { status: 'done', crowns: Math.min(5, (cur.crowns || 0) + 1) }
  next.xp = (p.xp || 0) + gainedXp

  const today = dayStr()
  if (p.lastDay !== today) {
    const yesterday = dayStr(new Date(Date.now() - 864e5))
    next.streak = p.lastDay === yesterday ? (p.streak || 0) + 1 : 1
    next.lastDay = today
  }
  return next
}

// Liste ordonnée des leçons débloquables (chapitres verrouillés exclus).
export function flattenLessons(course) {
  const out = []
  for (const ch of course.chapters) {
    if (ch.locked) continue
    for (const u of ch.units || []) {
      for (const l of u.lessons || []) out.push(l)
    }
  }
  return out
}

// Statut d'une leçon : 'done' | 'available' | 'locked'.
export function lessonStatus(p, course, lessonId) {
  if (p.lessons[lessonId]?.status === 'done') return 'done'
  const flat = flattenLessons(course)
  const firstUndone = flat.findIndex((l) => p.lessons[l.id]?.status !== 'done')
  const idx = flat.findIndex((l) => l.id === lessonId)
  if (idx === -1) return 'locked'
  if (idx < firstUndone || firstUndone === -1) return 'done'
  return idx === firstUndone ? 'available' : 'locked'
}
