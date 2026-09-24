import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import BookCover from '../components/Book/BookCover'
import { useLibrary } from '../hooks/useLibrary'

export default function BookPreview() {
  const { id } = useParams()
  const nav = useNavigate()
  const { getBook } = useLibrary()
  const book = getBook(id)
  const back = () => (window.history.state?.idx > 0 ? nav(-1) : nav('/biblioteca'))

  if (!book) {
    return (
      <main className="preview">
        <h1>Este volume não está nas estantes.</h1>
        <Link className="btn-quiet" to="/biblioteca">
          <ChevronLeft size={16} aria-hidden="true" /> Voltar à biblioteca
        </Link>
      </main>
    )
  }

  return (
    <main className="preview">
      <h1>{book.title}</h1>
      <BookCover book={book} />
      {book.chapters.length ? (
        <button type="button" className="btn-gold" onClick={() => nav(`/livro/${book.id}/ler`)}>
          Abrir livro
        </button>
      ) : (
        <p className="tagline">As páginas deste volume estão em branco.</p>
      )}
      <button type="button" className="btn-quiet" onClick={back}>
        <ChevronLeft size={16} aria-hidden="true" /> Voltar
      </button>
    </main>
  )
}
