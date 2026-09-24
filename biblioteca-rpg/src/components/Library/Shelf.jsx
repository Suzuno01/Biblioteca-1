import { useRef } from 'react'
import { Link } from 'react-router-dom'
import BookSpine from './BookSpine'
import useWidth from '../../hooks/useWidth'
import { ShelfIcon } from '../../utils/icons'

// Estante 2D: moldura de madeira, fundo na cor da estante e livros em fileiras sobre tábuas.
export default function Shelf({ shelf, books, focus = false }) {
  const ref = useRef(null)
  const width = useWidth(ref)
  const k = focus ? 1.28 : 1
  const perRow = Math.max(3, Math.floor(((width || 720) - 20) / (50 * k + 5)))
  const rows = []
  for (let i = 0; i < books.length; i += perRow) rows.push(books.slice(i, i + perRow))
  if (!rows.length) rows.push([])

  const plate = (
    <>
      <ShelfIcon name={shelf.icon} size={16} />
      <span>{shelf.name}</span>
    </>
  )

  return (
    <section className={'shelf' + (focus ? ' focus' : '')} style={{ '--shelf': shelf.color }}>
      <header className="shelf-head">
        {focus ? (
          <h2 className="plate">{plate}</h2>
        ) : (
          <Link className="plate" to={`/estante/${shelf.id}`} aria-label={`Abrir estante ${shelf.name}`}>
            {plate}
          </Link>
        )}
      </header>
      <div className="frame">
        <div className="case" ref={ref}>
          {rows.map((row, i) => (
            <div className="row" key={i}>
              <div className="books">
                {row.length ? (
                  row.map((b) => <BookSpine key={b.id} book={b} />)
                ) : (
                  <p className="empty-shelf">Nenhum volume nesta estante.</p>
                )}
              </div>
              <div className="plank" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
