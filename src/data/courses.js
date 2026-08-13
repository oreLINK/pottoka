import { byId } from './registry'

const metaModules = import.meta.glob('./courses/**/*.json', { eager: true, import: 'default' })
const mdModules = import.meta.glob('./courses/**/*.md', { eager: true, query: '?raw', import: 'default' })

const metaById = byId(metaModules)
const mdById = byId(mdModules)

export const coursesById = Object.fromEntries(
  Object.keys(metaById).map((id) => [id, { ...metaById[id], markdown: mdById[id] || '' }])
)
