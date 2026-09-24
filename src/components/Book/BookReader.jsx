import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, List, X } from 'lucide-react'
import BookPage from './BookPage'
import { pageVars } from '../../utils/bookStyle'
import { roman } from '../../utils/helpers'

export default function BookReader({ book, index, onIndex, onClose }) {
  const [toc, setToc] = useState(false)
  const total = book.chapters.length
  const chapter = book.chapters[index]
  const last = index >= total - 1

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' && index < total - 1) onIndex(index + 1)
      if (e.key === 'ArrowLeft' && index > 0) onIndex(index - 1)
      if (e.key === 'Escape') setToc(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, total, onIndex])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [index])

  return (
    <div className="reader" style={{ '--cover': book.coverColor, ...pageVars(book.appearance) }}>
      <header className="reader-bar">
        <button type="button" className="btn-quiet" onClick={onClose}>
          <X size={16} aria-hidden="true" /> Fechar
        </button>
        <span className="reader-book">{book.displayTitle || book.title}</span>
        {total > 1 ? (
          <button type="button" className="btn-quiet" aria-expanded={toc} onClick={() => setToc(!toc)}>
            <List size={16} aria-hidden="true" /> Capítulos
          </button>
        ) : (
          <span />
        )}
        {toc && (
          <nav className="toc" aria-label="Capítulos">
            {book.chapters.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={i === index ? 'on' : ''}
                onClick={() => {
                  onIndex(i)
                  setToc(false)
                }}
              >
                <span>{roman(i + 1)}</span> {c.title}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="reader-main">
        <div className="sheet-frame">
          {chapter ? (
            <BookPage key={chapter.id} book={book} chapter={chapter} number={index + 1} total={total} />
          ) : (
            <p className="empty-note">As páginas deste volume estão em branco.</p>
          )}
        </div>
      </main>

      <footer className="reader-nav">
        <button type="button" className="nav-btn" disabled={index <= 0} onClick={() => onIndex(index - 1)}>
          <ChevronLeft size={16} aria-hidden="true" /> Anterior
        </button>
        {total > 1 && (
          <span className="reader-pos">
            {index + 1} / {total}
          </span>
        )}
        {last ? (
          <button type="button" className="nav-btn" onClick={onClose}>
            Fechar livro <X size={16} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="nav-btn" onClick={() => onIndex(index + 1)}>
            Próximo <ChevronRight size={16} aria-hidden="true" />
          </button>
        )}
      </footer>
    </div>
  )
}
