// Transforme le résultat d'un import.meta.glob (chemin -> contenu) en un
// dictionnaire indexé par id de fichier (nom sans extension, quelle qu'elle
// soit — .json, .md...).
export function byId(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, data]) => [path.match(/([^/]+)\.[^./]+$/)[1], data])
  )
}
