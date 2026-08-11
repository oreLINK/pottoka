# 🐴 Pottoka

Site **statique** pour apprendre le **basque (euskara)** en français, façon Duolingo.
Mascotte : **Pottoka**, le poney pottok à la txapela rouge.

- Sens d'apprentissage : **français → basque**
- Pas de backend : toute la progression vit dans le navigateur (`localStorage`)
- Contenu (lexique, exercices, cours) **séparé** du code, facile à éditer
- Stack : **React + Vite**, CSS maison (aucune dépendance UI)

> ⚠️ Le contenu basque livré est un **contenu de départ à faire valider** par un·e bascophone.

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build statique dans dist/
npm run preview  # prévisualise le build
```

`dist/` est un site 100 % statique : déployable tel quel (GitHub Pages, Netlify, un simple hébergeur…). `base: './'` est déjà réglé pour fonctionner dans un sous-dossier.

## Architecture

```
src/
├─ data/            CONTENU (éditable sans toucher au code)
│  ├─ lexicon.js         mots source (fr / eu / range)   ← le plus simple à éditer
│  ├─ customExercises.js exercices écrits à la main (phrases, textes à trous)
│  ├─ bank.js            construit la banque : exercices générés + custom
│  └─ course.js          arbre Chapitre → Unité → Leçon (+ règles de sélection)
├─ engine/          LOGIQUE pure (testable, sans React)
│  ├─ normalize.js       normalisation des réponses (casse / accents / espaces)
│  ├─ select.js          moteur random / ordered / all + whitelist / blacklist
│  ├─ grade.js           correction par type d'exercice
│  └─ progress.js        progression + déverrouillage (localStorage)
├─ hooks/useProgress.js
└─ components/
   ├─ Pottoka.jsx        mascotte SVG (expressions : happy / cheer / sad / wave)
   ├─ Path.jsx           chemin d'apprentissage (accueil)
   ├─ LessonPlayer.jsx   barre de progression, cœurs, feedback
   ├─ Results.jsx        écran de fin
   └─ exercises/         un composant par type d'exercice + ExerciseRenderer
```

## Modèle de données

Un **exercice** ne sait pas dans quelle leçon il vit : il porte juste des `tags`.

```js
{ id: 'mcqfe-hiru', type: 'mcq_word', tags: ['chiffres', '0-4', '0-9'], payload: { … } }
```

Une **leçon** décrit *comment* choisir ses exercices, pas lesquels :

```js
{
  id: 'ch1-u1-l1', title: 'Chiffres 0 à 4', count: 8, xp: 15,
  selection: {
    mode: 'random',                 // 'random' | 'ordered' | 'all'
    filter: { anyTag: ['0-4'] },    // pioche par tags
    orderlist: [/* ids */],         // utilisé seulement si mode = 'ordered'
    whitelist: [/* toujours inclus */],
    blacklist: [/* jamais inclus */]
  }
}
```

Algorithme (`engine/select.js`) : point de départ (orderlist ou banque filtrée) → on retire la blacklist → on force la whitelist → random mélange / ordered garde l'ordre → on tronque à `count`. La même banque « chiffres 0-9 » alimente ainsi une leçon d'apprentissage *random* **et** une révision *ordered*, sans dupliquer un exercice.

## Types d'exercices implémentés (V1)

| type | description | correction |
|------|-------------|-----------|
| `new_word_card` | intro d'un nouveau mot | — |
| `mcq_word` | QCM 4 choix (fr→eu et eu→fr) | option correcte |
| `free_translation` | traduction libre au clavier | normalisée |
| `fill_blank` | texte à trous | normalisée |
| `word_bank` | phrase à reconstituer avec blocs (+ parasites) | ordre des mots |
| `match_pairs` | associer les paires fr ↔ eu | toutes appariées |

**Normalisation** (`normalize.js`) : minuscules → retrait des accents → ponctuation ignorée → espaces réduits. Note basque : `ñ`→`n`, `ü`→`u` par **tolérance de saisie** ; l'orthographe correcte reste stockée et affichée, on ne normalise que pour comparer. `payload.accepted` accepte plusieurs réponses valides.

## À venir (non inclus en V1)

- **Audio** (compréhension orale, dictée) → V2
- `mcq_image` (QCM avec images) — le type est prévu, le composant reste à faire
- **Art des expressions** de Pottoka (déclinaisons animées)
- Reconnaissance vocale (hors périmètre : support navigateur quasi inexistant en basque)

## Ajouter du contenu

1. **Un mot** → une ligne dans `data/lexicon.js` (les QCM, associations et traduction libre sont générés automatiquement).
2. **Un exercice sur mesure** (phrase, texte à trous) → un objet dans `data/customExercises.js`.
3. **Une leçon / unité / chapitre** → `data/course.js`, avec sa règle `selection`.

## Licence

MIT — voir `LICENSE`.
