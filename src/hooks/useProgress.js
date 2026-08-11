import { useState, useCallback } from 'react'
import { loadProgress, saveProgress, completeLesson } from '../engine/progress'

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress)

  const finishLesson = useCallback((lessonId, gainedXp) => {
    setProgress((p) => {
      const next = completeLesson(p, lessonId, gainedXp)
      saveProgress(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    const fresh = { xp: 0, streak: 0, lastDay: null, lessons: {} }
    saveProgress(fresh)
    setProgress(fresh)
  }, [])

  return { progress, finishLesson, reset }
}
