// Générateur algorithmique des noms de nombres en basque (système vigésimal :
// hogei = 20, hogeita hamar = 30 "20+10", ehun = 100, mila = 1000, milioi = million).
// Les formes 0-19 sont importées des groupes de contenu (déjà validées) —
// même source que la leçon "0 à 10", une correction s'applique aux deux à la
// fois. Les règles de composition ci-dessous (contraction -ta, liaison "eta",
// préfixes des centaines, ordre "milioi bat") sont une PROPOSITION À FAIRE
// VALIDER PAR UN BASCOPHONE, au même titre que le reste du contenu.
import numbers0to10 from '../data/groups/numbers/numbers-0-10.json'
import numbers11to20 from '../data/groups/numbers/numbers-11-20.json'

const UNITS = [...numbers0to10.items, ...numbers11to20.items]
  .filter((w) => w.value < 20)
  .sort((a, b) => a.value - b.value)
  .map((w) => w.eu)

const TWENTIES = { 20: 'hogei', 40: 'berrogei', 60: 'hirurogei', 80: 'laurogei' }
const HUNDREDS_PREFIX = { 2: 'berr', 3: 'hirur', 4: 'laur', 5: 'bost', 6: 'sei', 7: 'zazpi', 8: 'zortzi', 9: 'bederatzi' }

// Échappatoire pour corriger ponctuellement une forme générée, sans toucher
// à l'algorithme (clé = valeur numérique, valeur = forme basque exacte).
const OVERRIDES = {}

function under100(n) {
  if (n < 20) return UNITS[n]
  const base = Math.floor(n / 20) * 20
  const rem = n % 20
  return rem === 0 ? TWENTIES[base] : `${TWENTIES[base]}ta ${UNITS[rem]}`
}

function under1000(n) {
  if (n < 100) return under100(n)
  const h = Math.floor(n / 100)
  const rem = n % 100
  const hWord = h === 1 ? 'ehun' : `${HUNDREDS_PREFIX[h]}ehun`
  return rem === 0 ? hWord : `${hWord} eta ${under100(rem)}`
}

function under1e6(n) {
  if (n < 1000) return under1000(n)
  const th = Math.floor(n / 1000)
  const rem = n % 1000
  const thWord = th === 1 ? 'mila' : `${under1000(th)} mila`
  return rem === 0 ? thWord : `${thWord} eta ${under1000(rem)}`
}

export function toBasque(n) {
  if (OVERRIDES[n] != null) return OVERRIDES[n]
  if (n === 0) return UNITS[0]
  if (n < 1000000) return under1e6(n)

  const m = Math.floor(n / 1000000)
  const rem = n % 1000000
  const mWord = m === 1 ? 'milioi bat' : `${under1e6(m)} milioi`
  return rem === 0 ? mWord : `${mWord} eta ${under1e6(rem)}`
}
