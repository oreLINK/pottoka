import Pottoka from './Pottoka'

// Écran de fin de leçon : XP gagnés + score de bonnes réponses.
export default function Results({ result, onContinue }) {
  const { xp, correctCount, total } = result
  return (
    <div className="lesson lesson--end">
      <Pottoka expression="cheer" size={150} />
      <h2>Ederki! · Bien joué</h2>
      <div className="result-stats">
        <div className="result-stat result-stat--gold">
          <span className="result-stat-num">+{xp}</span>
          <span className="result-stat-label">XP</span>
        </div>
        <div className="result-stat result-stat--green">
          <span className="result-stat-num">{correctCount}/{total}</span>
          <span className="result-stat-label">bonnes réponses</span>
        </div>
      </div>
      <button className="btn btn--primary" onClick={onContinue}>Continuer</button>
    </div>
  )
}
