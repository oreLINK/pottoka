import { useState } from 'react'
import Path from './components/Path'
import LessonPlayer from './components/LessonPlayer'
import Results from './components/Results'
import { course } from './data/course'
import { bank } from './data/bank'
import { resolveLesson } from './engine/select'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const { progress, finishLesson, reset } = useProgress()
  const [view, setView] = useState('home') // 'home' | 'lesson' | 'results'
  const [active, setActive] = useState(null) // { lesson, exercises }
  const [result, setResult] = useState(null)

  function startLesson(lesson) {
    const exercises = resolveLesson(lesson, bank)
    if (!exercises.length) return
    setActive({ lesson, exercises })
    setView('lesson')
  }

  function completeLesson(res) {
    finishLesson(active.lesson.id, res.xp)
    setResult(res)
    setView('results')
  }

  return (
    <div className="app">
      {view === 'home' && (
        <Path course={course} progress={progress} onStart={startLesson} onReset={reset} />
      )}

      {view === 'lesson' && active && (
        <LessonPlayer
          lesson={active.lesson}
          exercises={active.exercises}
          onComplete={completeLesson}
          onQuit={() => setView('home')}
        />
      )}

      {view === 'results' && result && (
        <Results result={result} onContinue={() => setView('home')} />
      )}
    </div>
  )
}
