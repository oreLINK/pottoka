# Exercices disponibles

Chaque exercice a un `type` (string) qui sert de clé dans le registre
[`ExerciseRenderer.jsx`](./ExerciseRenderer.jsx) pour choisir le composant à
afficher. Un composant d'exercice ne fait que deux choses : afficher
`ex.payload` et remonter la réponse de l'utilisateur via `onChange(value)` —
il ne valide jamais lui-même la réponse. La validation est centralisée dans
[`src/engine/grade.js`](../../engine/grade.js) (`grade(ex, answer)` pour
juste/faux, `canCheck(ex, answer)` pour savoir si le bouton "Vérifier" peut
s'activer), et le déclenchement de la validation vit dans
[`LessonPlayer.jsx`](../LessonPlayer.jsx).

Props communes à tous les composants : `ex` (l'exercice), `value`/`onChange`
(réponse courante et son setter), `locked` (true une fois la réponse
validée — désactive les interactions). `mcq_word` reçoit en plus `checked`
et `correct` pour colorer les options après validation.

Deux modes de validation :
- **Automatique** : dès que la réponse est complète, `LessonPlayer` valide
  seul (pas de bouton "Vérifier"). Utilisé par `mcq_word` (un tap sur une
  option) et `match_pairs` (toutes les paires associées).
- **Manuelle** : l'utilisateur doit appuyer sur "Vérifier", actif dès que
  `canCheck(ex, answer)` est vrai. Utilisé par `new_word_card`,
  `free_translation`, `fill_blank`, `word_bank`.

## `new_word_card`

Fichier : [`NewWordCard.jsx`](./NewWordCard.jsx)

Carte d'introduction d'un nouveau mot, sans saisie ni question — juste un mot
basque affiché en grand avec sa traduction française en dessous.

- **Payload** : `{ fr, eu, hint? }` (`hint` optionnel, affiché après le
  français, ex. "· le chiffre 6").
- **Interaction** : aucune, l'utilisateur lit puis appuie sur "Vérifier".
- **Validation** : toujours correcte (`grade` renvoie `true`
  inconditionnellement) ; `canCheck` renvoie `true` dès l'affichage.

## `mcq_word`

Fichier : [`MultipleChoiceWord.jsx`](./MultipleChoiceWord.jsx)

QCM à 4 choix (une traduction correcte + 3 distracteurs). `value` = l'index
choisi.

- **Payload** : `{ prompt, promptLang, answerLang, options }` où `options`
  est un tableau de `{ text, correct }`.
- **Interaction** : taper sur une option appelle `onChange(index)`.
  Validation **immédiate** au clic (voir plus haut) — pas de bouton
  "Vérifier". Une fois verrouillé, l'option choisie se colore en vert
  (correct) ou rouge (faux), et la bonne réponse est mise en évidence en
  vert si l'utilisateur s'est trompé.
- **Validation** : correct si `options[answer].correct` est vrai.

## `free_translation`

Fichier : [`FreeTranslation.jsx`](./FreeTranslation.jsx)

Traduction libre au clavier (un mot ou une courte phrase).

- **Payload** : `{ prompt, promptLang, answerLang, accepted }` — `accepted`
  est un tableau de réponses acceptées (pour couvrir les variantes
  orthographiques).
- **Interaction** : champ texte libre, `onChange(e.target.value)` à chaque
  frappe.
- **Validation** : manuelle (bouton "Vérifier", actif dès que le champ n'est
  pas vide). Correct si la réponse normalisée correspond à l'une des
  `accepted` normalisées. La normalisation
  ([`engine/normalize.js`](../../engine/normalize.js)) tolère la casse, les
  accents/diacritiques (ñ, ü…), la ponctuation et les espaces multiples.

## `fill_blank`

Fichier : [`FillBlank.jsx`](./FillBlank.jsx)

Texte à trous : un `___` dans `text` est remplacé par un champ de saisie
inline.

- **Payload** : `{ prompt, text, accepted }` — `text` contient littéralement
  `___` comme marqueur du trou, `accepted` = réponses acceptées pour le mot
  manquant.
- **Interaction** : champ texte inline, `onChange(e.target.value)` à chaque
  frappe.
- **Validation** : manuelle (bouton "Vérifier"), même logique de
  normalisation tolérante que `free_translation`.

## `word_bank`

Fichier : [`WordBank.jsx`](./WordBank.jsx)

Construction d'une phrase en assemblant des blocs de mots dans le bon ordre
(façon Duolingo), avec quelques blocs "parasites" (distracteurs) mélangés
dedans.

- **Payload** : `{ prompt, promptLang, answer, distractors? }` — `answer`
  est la séquence ordonnée de mots attendue, `distractors` des mots en trop
  à ne pas utiliser.
- **Interaction** : taper un mot de la banque le déplace dans la zone de
  réponse (et inversement pour le retirer) ; `onChange` remonte le tableau
  ordonné des mots placés à chaque changement.
- **Validation** : manuelle (bouton "Vérifier", actif dès qu'au moins un mot
  est placé). Correct si la séquence placée correspond exactement (ordre
  inclus) à `answer`, mots normalisés un par un (`tokensEqual`).

## `match_pairs`

Fichier : [`MatchPairs.jsx`](./MatchPairs.jsx)

Association de paires fr ↔ eu : deux colonnes mélangées indépendamment,
cliquer un élément de chaque colonne tente une association.

- **Payload** : `{ pairs }` — tableau de `{ fr, eu }`.
- **Interaction** : clic sur un élément à gauche puis un à droite (ou
  l'inverse). Bonne paire → les deux éléments disparaissent
  (`match-item--done`). Mauvaise paire → les deux clignotent en rouge
  (`match-item--wrong`, 450 ms) puis se désélectionnent. Quand toutes les
  paires sont faites, le composant remonte `onChange('done')`.
- **Validation** : **automatique** dès que `value === 'done'` (toutes les
  paires associées) — pas de bouton "Vérifier", juste un texte d'aide
  ("Associe toutes les paires pour continuer.").

## Ajouter un nouveau type d'exercice

1. Créer le composant dans ce dossier (mêmes props que les autres : `ex`,
   `value`, `onChange`, `locked`, …).
2. L'enregistrer dans `ExerciseRenderer.jsx` (`REGISTRY`).
3. Ajouter un `case` dans `grade()` et `canCheck()`
   ([`engine/grade.js`](../../engine/grade.js)).
4. Si la validation doit être immédiate (comme `mcq_word`/`match_pairs`),
   ajouter le type dans l'effet d'auto-validation de `LessonPlayer.jsx`.

Les exercices eux-mêmes sont produits à partir du contenu JSON
(`src/data/lessons/*.json` + `src/data/groups/*.json`) par
[`src/engine/calls.js`](../../engine/calls.js) — voir ce fichier pour savoir
comment un `type` ci-dessus se retrouve rempli avec un payload concret.
