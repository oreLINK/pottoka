import { useMemo, useState } from 'react'
import MarkdownView from './MarkdownView'
import { coursesById } from '../data/courses'
import { parseMarkdownPages } from '../engine/markdown'

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
function IconArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Lecteur de cours : contenu Markdown paginé (une page par titre ##), avec
// navigation par flèches. Réutilise le squelette lesson/lesson-top/
// lesson-body/footer de LessonPlayer (titre + flèches fixes, contenu seul
// scrollable) — pas de notion de validation, juste de la lecture.
export default function CoursePlayer({ courseId, onQuit }) {
  const course = coursesById[courseId]
  const pages = useMemo(() => parseMarkdownPages(course?.markdown), [course])
  const [pageIndex, setPageIndex] = useState(0)

  if (!course || !pages.length) return null

  const isLast = pageIndex + 1 >= pages.length

  return (
    <div className="lesson lesson--play">
      <div className="lesson-top">
        <button className="iconbtn" aria-label="Quitter le cours" onClick={onQuit}><IconClose /></button>
        <div className="lesson-top-title">{course.title}</div>
      </div>

      <div className="lesson-body">
        <MarkdownView blocks={pages[pageIndex].blocks} />
      </div>

      <div className="footer footer--nav">
        <button
          type="button"
          className="nav-btn"
          aria-label="Page précédente"
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((i) => i - 1)}
        >
          <IconArrowLeft />
        </button>
        <span className="page-indicator">
          <span className="page-indicator-current">{pageIndex + 1}</span>
          <span className="page-indicator-total">/{pages.length}</span>
        </span>
        {isLast ? (
          <button type="button" className="btn btn--primary btn--sm" onClick={onQuit}>Terminer</button>
        ) : (
          <button
            type="button"
            className="nav-btn"
            aria-label="Page suivante"
            onClick={() => setPageIndex((i) => i + 1)}
          >
            <IconArrowRight />
          </button>
        )}
      </div>
    </div>
  )
}
