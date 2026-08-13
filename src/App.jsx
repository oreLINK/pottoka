import { useState, useEffect } from 'react'
import Path from './components/Path'
import Sidebar from './components/Sidebar'
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
  // Id d'ancre à rejoindre une fois de retour sur l'accueil (clic sur la
  // sidebar depuis une leçon/un cours : on quitte puis on scrolle).
  const [scrollTarget, setScrollTarget] = useState(null)

  useEffect(() => {
    if (view !== 'home' || !scrollTarget) return
    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setScrollTarget(null)
  }, [view, scrollTarget])

  function goHome(anchorId) {
    setView('home')
    if (anchorId) setScrollTarget(anchorId)
  }

  function startItem(id) {
    const item = resolvePathItem(id)
    if (!item) return

    // Le scroll de la page (accumulé en parcourant le chemin) ne se
    // réinitialise pas tout seul quand on change d'écran : sans ça, le
    // lecteur s'affiche à l'endroit où on avait scrollé dans le chemin.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

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
    <div className="shell">
      <Sidebar tree={tree} onNavigate={goHome} />

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
    </div>
  )
}
