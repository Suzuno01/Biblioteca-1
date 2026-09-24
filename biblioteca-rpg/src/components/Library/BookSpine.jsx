import { useNavigate } from 'react-router-dom'
import BookCover from '../Book/BookCover'
import { dims, readableOn } from '../../utils/helpers'

// Lombada de um livro na estante. Com `preview`, vira só um desenho (usado no admin).
export default function BookSpine({ book, preview = false }) {
  const nav = useNavigate()
  const { w, h, lean } = dims(book.id)
  const style = { '--w': w, '--h': h, '--c': book.spineColor, '--fg': readableOn(book.spineColor) }
  const cls = 'spine' + (lean ? ' lean' : '')
  const label = book.displayTitle || book.title

  if (preview) {
    return (
      <span className={cls} style={style}>
        <span className="spine-label">{label}</span>
      </span>
    )
  }
  return (
    <button type="button" className={cls} style={style} aria-label={book.title} onClick={() => nav(`/livro/${book.id}`)}>
      <span className="spine-label">{label}</span>
      <span className="tip">
        {book.cover && <BookCover book={book} />}
        <b>{book.title}</b>
      </span>
    </button>
  )
}
