import { useMemo } from 'react'
import { pageVars } from '../../utils/bookStyle'
import { sanitizeHtml } from '../../utils/sanitize'
import { roman } from '../../utils/helpers'

// Uma página do livro: cabeçalho do capítulo + conteúdo, com a aparência do livro.
export default function BookPage({ book, chapter, number = 1, total = 1 }) {
  const html = useMemo(() => sanitizeHtml(chapter.content), [chapter.content])
  const texture = book.appearance?.texture || 'none'
  return (
    <article className={`book-page tex-${texture}`} style={pageVars(book.appearance)}>
      <header className="chapter-head">
        {total > 1 && <span className="chapter-no">Capítulo {roman(number)}</span>}
        <h1>{chapter.title}</h1>
        <i className="ornament" />
      </header>
      <div className="book-content" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  )
}
