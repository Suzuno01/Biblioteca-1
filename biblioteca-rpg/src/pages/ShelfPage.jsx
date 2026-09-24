import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Shelf from '../components/Library/Shelf'
import { useLibrary } from '../hooks/useLibrary'

export default function ShelfPage() {
  const { id } = useParams()
  const { getShelf, booksOfShelf } = useLibrary()
  const shelf = getShelf(id)

  return (
    <main className="lib">
      <div className="lib-top">
        <Link className="ghost-link" to="/biblioteca">
          <ChevronLeft size={16} aria-hidden="true" /> Biblioteca
        </Link>
        <span />
        <span className="lib-spacer" />
      </div>
      {shelf ? (
        <div className="shelf-wrap">
          <Shelf focus shelf={shelf} books={booksOfShelf(shelf.id)} />
          {shelf.description && <p className="shelf-desc">{shelf.description}</p>}
        </div>
      ) : (
        <p className="empty-note">Esta estante não existe.</p>
      )}
    </main>
  )
}
