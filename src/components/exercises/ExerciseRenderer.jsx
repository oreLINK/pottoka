import NewWordCard from './NewWordCard'
import MultipleChoiceWord from './MultipleChoiceWord'
import FreeTranslation from './FreeTranslation'
import FillBlank from './FillBlank'
import WordBank from './WordBank'
import MatchPairs from './MatchPairs'

// Aiguillage par type. Ajouter un type = ajouter un composant + une entrée ici.
const REGISTRY = {
  new_word_card: NewWordCard,
  mcq_word: MultipleChoiceWord,
  free_translation: FreeTranslation,
  fill_blank: FillBlank,
  word_bank: WordBank,
  match_pairs: MatchPairs
}

export default function ExerciseRenderer(props) {
  const Cmp = REGISTRY[props.ex.type]
  if (!Cmp) return <div className="ex">Type d'exercice inconnu : {props.ex.type}</div>
  return <Cmp {...props} />
}
