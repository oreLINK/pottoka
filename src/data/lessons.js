import { byId } from './registry'

const modules = import.meta.glob('./lessons/**/*.json', { eager: true, import: 'default' })
export const lessonsById = byId(modules)
