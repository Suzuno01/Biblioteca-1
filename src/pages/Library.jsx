import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Shelf from '../components/Library/Shelf'
import { useLibrary } from '../hooks/useLibrary'

export default function Library() {
  const { shelves, booksOfShelf, settings } = useLibrary()
  const bg = settings.backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(3,6,12,.75),rgba(3,6,12,.92)), url("${settings.backgroundImage}")` }
    : undefined

  return (
    <main className="lib" style={bg}>
      <div className="lib-top">
        <Link className="ghost-link" to="/">
          <ChevronLeft size={16} aria-hidden="true" /> Sair
        </Link>
        <h1 className="lib-title">{settings.libraryName}</h1>
        <span className="lib-spacer" />
      </div>
      {shelves.length ? (
        <div className="shelves">
          {shelves.map((s) => (
            <Shelf key={s.id} shelf={s} books={booksOfShelf(s.id)} />
          ))}
        </div>
      ) : (
        <p className="empty-note">Nenhuma estante foi montada ainda.</p>
      )}
    </main>
  )
}
