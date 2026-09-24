import { fontStack } from '../../utils/fonts'
import { readableOn } from '../../utils/helpers'

// Capa: imagem enviada ou capa gerada (cor + título + fonte).
export default function BookCover({ book, className = '' }) {
  const style = {
    '--cc': book.coverColor,
    '--cf': fontStack(book.coverFont || 'cinzel'),
    '--cfg': readableOn(book.coverColor),
  }
  return (
    <span className={`cover ${className}`} style={style}>
      {book.cover ? (
        <img src={book.cover} alt={`Capa de ${book.title}`} />
      ) : (
        <span className="cover-auto">
          <span className="cover-frame" />
          <span className="cover-title">{book.title}</span>
        </span>
      )}
    </span>
  )
}
