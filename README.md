# 🐴 Pottoka

Site **statique** pour apprendre le **basque (euskara)** en français, façon Duolingo.
Mascotte : **Pottoka**, le poney pottok à la txapela rouge.

- Sens d'apprentissage : **français → basque**
- Pas de backend, pas de compte : rien n'est persisté (pas de `localStorage`) — chaque session repart de zéro
- Contenu (vocabulaire, exercices, leçons de lecture) **séparé** du code, en JSON/Markdown, éditable sans toucher au JS
- Stack : **React + Vite**, CSS maison (aucune dépendance UI, aucun framework CSS)
- Responsive : une seule mise en page qui s'adapte du mobile au bureau (barre latérale de navigation à partir de 900px), pas d'app séparée

> ⚠️ Le contenu basque livré est un **contenu de départ à faire valider** par un·e bascophone (voir les notes "À vérifier" dans les cours, et le commentaire en tête de `engine/basqueNumbers.js`).

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
```

`dist/` est un site 100 % statique : déployable tel quel (GitHub Pages, Netlify, un simple hébergeur…). `base: './'` dans `vite.config.js` est déjà réglé pour fonctionner dans un sous-dossier quelconque. Le dépôt inclut un workflow GitHub Actions (`.github/workflows/deploy.yml`) qui build et déploie `main` sur la branche `gh-pages` à chaque push.

## Architecture

```
src/
├─ data/                  CONTENU (éditable sans toucher au code)
│  ├─ tree.json               arbre chapitres → unités → ids de leçons/cours (ordre d'affichage)
│  ├─ registry.js              helper : import.meta.glob -> dict indexé par id de fichier
│  ├─ lessons.js / courses.js / groups.js   chargent respectivement lessons/, courses/, groups/
│  ├─ pathItems.js             résout un id de tree.json en { kind: 'lesson'|'course', data }
│  ├─ lessons/<chapId>/<unitId>/<id>.json    une leçon = { title, description, count, calls[] }
│  ├─ courses/<chapId>/<unitId>/<id>.json+.md   un cours = meta JSON + contenu Markdown paginé
│  └─ groups/<thème>/<id>.json                groupes de vocabulaire (voir plus bas)
├─ engine/                 LOGIQUE pure (testable, sans React)
│  ├─ calls.js                  résout une leçon en exercices concrets (cœur du système)
│  ├─ markdown.js               mini-parseur Markdown pour le contenu des cours
│  ├─ basqueNumbers.js           générateur algorithmique des nombres basques (vigésimal)
│  ├─ numberExercises.js         génère des exercices pour des plages de nombres trop grandes pour un groupe
│  ├─ normalize.js               normalisation des réponses (casse / accents / ponctuation)
│  └─ grade.js                   correction + "peut-on vérifier ?" par type d'exercice
└─ components/
   ├─ App.jsx                 état global (vue active), pas de router
   ├─ Path.jsx                chemin d'apprentissage en zigzag (écran d'accueil)
   ├─ Sidebar.jsx              barre latérale desktop (≥900px), table des matières
   ├─ NavPicker.jsx            popup plein écran "aller à…" (chapitres / unités d'un chapitre)
   ├─ LessonPlayer.jsx         barre de progression, cœurs, validation des exercices
   ├─ CoursePlayer.jsx         lecture paginée d'un cours (contenu Markdown)
   ├─ Results.jsx              écran de fin de leçon
   ├─ Pottoka.jsx              mascotte SVG (expressions : happy / cheer / sad / wave)
   └─ exercises/               un composant par type d'exercice + ExerciseRenderer
      └─ README.md                 doc détaillée du contrat de chaque type d'exercice
```

## Modèle de contenu

### Arbre de navigation (`tree.json`)

```json
{
  "chapters": [
    {
      "id": "ch1", "title": "Chapitre 1 : Les bases", "titleEu": "...",
      "color": "#3AA655", "isDisplay": true,
      "units": [
        {
          "id": "ch1-u1", "title": "Unité 1 : Les chiffres et les nombres",
          "isDisplay": true,
          "lessons": ["ch1-u1-c1", "ch1-u1-l1", "ch1-u1-l2", "ch1-u1-l3", "ch1-u1-c2", "...👉 leçons et cours mélangés"]
        }
      ]
    }
  ]
}
```

- `units[].lessons` mélange volontairement des ids de **leçons** (exercices) et de **cours** (lecture) dans l'ordre où ils doivent apparaître dans le chemin — c'est la séquence pédagogique réelle (ex. un cours qui explique une règle, suivi de 3 leçons d'entraînement dessus).
- `isDisplay: false` masque entièrement un chapitre/une unité (chemin, sidebar, popups "aller à…") — sert à préparer du contenu sans le publier.
- `locked: true` sur un chapitre grise ses nœuds dans le chemin (verrou), sans les cacher.
- **Convention d'id** : un id de leçon se termine en `-lN`, un id de cours en `-cN` (`pathItems.js` s'en sert pour chercher dans le bon registre sans champ `kind` dans `tree.json`). Le dossier physique reflète la même hiérarchie : `data/lessons/<chapId>/<unitId>/<id>.json`.

### Leçons (`data/lessons/**/*.json`)

```json
{
  "title": "0 à 10 · Découverte",
  "description": "Découvre les nombres de 0 à 10 en euskara.",
  "count": 10,
  "calls": [
    { "type": "new_word_card", "groups": ["numbers-0-10"] },
    { "type": "mcq_word", "groups": ["numbers-0-10"] }
  ]
}
```

Une leçon ne liste **pas** ses exercices : `calls[]` décrit des *archétypes* (un type d'exercice + les groupes de vocabulaire dont il pioche). `engine/calls.js` (`resolveLesson`) pioche `count` fois au hasard parmi les lignes de `calls`, et génère à chaque pioche **un** exercice concret (mot/paire/phrase tirés au hasard dans les groupes). Avec moins de lignes que `count`, certaines lignes sont donc piochées plusieurs fois — chaque pioche reste randomisée (mot différent, sens fr→eu ou eu→fr différent, distracteurs différents), donc une même leçon ne se joue jamais deux fois pareil.

Types de lignes `calls[]` :
- `{ "type": "<exercise type>", "groups": ["<group id>", ...] }` — cas courant, voir la liste des types plus bas.
- `{ "kind": "literal", "type": "...", "payload": {...} }` — exercice écrit à la main tel quel, hors-groupe (utile pour du contenu non-vocabulaire, ex. une phrase de salutation).
- `{ "kind": "generated_number_range", "min": 100, "max": 1000 }` — cas spécial : seule ligne autorisée dans `calls`, délègue entièrement à `engine/numberExercises.js` pour les plages de nombres trop grandes pour être un groupe énuméré (au-delà de la centaine).

### Groupes de vocabulaire (`data/groups/**/*.json`)

Un groupe est soit une liste plate, soit une **union d'autres groupes** :

```json
// groupe plat
{ "items": [ { "fr": "un", "eu": "bat", "value": 1 }, ... ] }

// groupe composite (somme d'autres groupes, sans dupliquer le contenu)
{ "groups": ["numbers-0-10", "numbers-11-20", "...", "numbers-91-100"] }
```

`data/groups.js` résout les composites récursivement (avec détection de cycle). `value` sert de clé de tri pour `fill_blank` (suite à trous par position dans le groupe, pas forcément valeur ±1 — permet par exemple un groupe de dizaines 10/20/30…).

### Cours (`data/courses/**/*.{json,md}`)

Meta JSON (`{ title, description }`) + fichier `.md` séparé pour le contenu. Le Markdown est paginé automatiquement par `engine/markdown.js` : chaque `## Titre` démarre une nouvelle page (texte avant le premier `##` = page d'intro sans titre). Sous-ensemble volontairement limité (voir l'en-tête de `markdown.js`) : `**gras**`/`*italique*` non imbriqués, listes à un niveau, pas de liens ni de code inline, un titre seul dans son paragraphe.

## Types d'exercices

| type | payload | validation |
|------|---------|-----------|
| `new_word_card` | `{ fr, eu, hint? }` | toujours correct |
| `mcq_word` | `{ prompt, promptLang, answerLang, options: [{text, correct}] }` | option correcte, validation immédiate au tap |
| `free_translation` | `{ prompt, promptLang, answerLang, accepted: [...] }` | réponse normalisée ∈ `accepted` |
| `fill_blank` | `{ prompt, text (avec `___`), accepted: [...] }` | idem, normalisée |
| `word_bank` | `{ prompt, promptLang, answer: [...] (ordonné), distractors? }` | séquence exacte de blocs placés |
| `match_pairs` | `{ pairs: [{fr, eu}] }` | toutes les paires associées |

Détails complets (props communes, modes de validation auto/manuelle, comment ajouter un type) : [`src/components/exercises/README.md`](src/components/exercises/README.md).

**Normalisation** (`engine/normalize.js`) : minuscules → accents/diacritiques retirés (`ñ`→`n`, `ü`→`u`) → ponctuation ignorée → espaces réduits. C'est une tolérance de *saisie* : l'orthographe correcte reste stockée et affichée, seule la comparaison est normalisée. `payload.accepted` peut lister plusieurs réponses valides.

## Nombres basques (`engine/basqueNumbers.js`)

Générateur algorithmique (système vigésimal : `hogei`=20, `hogeita hamar`=30, `berrogei`=40 « deux fois vingt »…) utilisé par `numberExercises.js` pour les grandes plages. Les formes 0-19 viennent des groupes `numbers-0-10`/`numbers-11-20` (une correction là-bas corrige aussi le générateur). Un objet `OVERRIDES` (vide aujourd'hui) permet de corriger ponctuellement un nombre sans toucher à l'algorithme. **Règles de composition non validées par un·e bascophone** — à vérifier avant toute publication réelle.

## Mise en page responsive

Un seul vrai breakpoint CSS, `@media (min-width: 900px)` (fin de `index.css`) : en dessous (mobile **et** tablette), le contenu est toujours plein largeur ; à partir de 900px, une barre latérale fixe apparaît (`Sidebar.jsx`, table des matières du parcours) et le contenu se limite à une colonne de lecture centrée (~640px). Le popup "aller à…" (`NavPicker.jsx`) fonctionne identiquement des deux côtés du breakpoint (plein écran, `position: fixed`).

## Icônes / PWA

`public/` contient le jeu d'icônes complet (favicon SVG + PNG/ICO de repli, `apple-touch-icon` pour l'ajout à l'écran d'accueil iOS, icônes 192/512 + variantes *maskable* pour Android/Chrome/Edge) et `manifest.webmanifest`. Tout est référencé depuis `index.html` via `%BASE_URL%` (résolu par le `base` de `vite.config.js`).

## Ajouter du contenu

1. **Un groupe de vocabulaire** → un fichier JSON dans `data/groups/<thème>/` (`{ "items": [...] }`), ou une union de groupes existants (`{ "groups": [...] }`).
2. **Une leçon** → un fichier JSON dans `data/lessons/<chapId>/<unitId>/` avec `count` + `calls[]` référençant des groupes ; l'ajouter à `units[].lessons` dans `tree.json`.
3. **Un cours** (contenu de lecture) → une paire `.json`+`.md` dans `data/courses/<chapId>/<unitId>/`, même principe d'ajout à `tree.json`.
4. **Un nouveau type d'exercice** → voir la section dédiée de [`src/components/exercises/README.md`](src/components/exercises/README.md).

Rien à enregistrer ailleurs : les registres (`lessonsById`, `coursesById`, `groupsById`) se construisent automatiquement par scan de dossier (`import.meta.glob`) — un nouveau fichier au bon endroit suffit.

## Licence

MIT — voir `LICENSE`.
