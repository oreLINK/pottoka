import { byId } from './registry'

const modules = import.meta.glob('./groups/*.json', { eager: true, import: 'default' })
export const groupsById = byId(modules)
