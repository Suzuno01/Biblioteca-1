import { Navigate, useNavigate, useParams } from 'react-router-dom'
import BookReader from '../components/Book/BookReader'
import { useLibrary } from '../hooks/useLibrary'

export default function Reader() {
  const { id, chapter } = useParams()
  const nav = useNavigate()
  const { getBook } = useLibrary()
  const book = getBook(id)
  if (!book) return <Navigate to="/biblioteca" replace />

  const total = book.chapters.length
  const index = Math.min(Math.max((parseInt(chapter, 10) || 1) - 1, 0), Math.max(total - 1, 0))

  return (
    <BookReader
      book={book}
      index={index}
      onIndex={(i) => nav(`/livro/${book.id}/ler/${i + 1}`, { replace: true })}
      onClose={() => nav('/biblioteca')}
    />
  )
}
