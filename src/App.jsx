import { useState } from 'react'
import Path from './components/Path'
import LessonPlayer from './components/LessonPlayer'
import CoursePlayer from './components/CoursePlayer'
import Results from './components/Results'
import tree from './data/tree.json'
import { resolveLesson } from './engine/calls'
import { resolvePathItem } from './data/pathItems'

export default function App() {
  const [view, setView] = useState('home') // 'home' | 'lesson' | 'course' | 'results'
  const [active, setActive] = useState(null) // { exercises }
  const [activeCourseId, setActiveCourseId] = useState(null)
  const [result, setResult] = useState(null)

  function startItem(id) {
    const item = resolvePathItem(id)
    if (!item) return

    if (item.kind === 'course') {
      setActiveCourseId(id)
      setView('course')
      return
    }

    const exercises = resolveLesson(id)
    if (!exercises.length) return
    setActive({ exercises })
    setView('lesson')
  }

  function completeLesson(res) {
    setResult(res)
    setView('results')
  }

  return (
    <div className="app">
      {view === 'home' && (
        <Path tree={tree} onStart={startItem} />
      )}

      {view === 'lesson' && active && (
        <LessonPlayer
          exercises={active.exercises}
          onComplete={completeLesson}
          onQuit={() => setView('home')}
        />
      )}

      {view === 'course' && activeCourseId && (
        <CoursePlayer courseId={activeCourseId} onQuit={() => setView('home')} />
      )}

      {view === 'results' && result && (
        <Results result={result} onContinue={() => setView('home')} />
      )}
    </div>
  )
}
