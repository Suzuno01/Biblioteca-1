import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import Button from '../UI/Button'
import Modal from '../UI/Modal'
import BookForm from './BookForm'
import BookCover from '../Book/BookCover'
import { useLibrary } from '../../hooks/useLibrary'
import { createBook, deleteBook, moveBook, reorderBook } from '../../services/libraryService'

export default function BookManager() {
  const { shelves, booksOfShelf } = useLibrary()
  const nav = useNavigate()
  const [creating, setCreating] = useState(false)
  const [over, setOver] = useState(null)

  if (!shelves.length) {
    return (
      <section>
        <h2>Livros</h2>
        <p className="adm-muted">
          Crie uma estante antes de criar livros. <Link to="/admin/estantes">Ir para Estantes</Link>
        </p>
      </section>
    )
  }

  const create = (data) => {
    try {
      const book = createBook(data)
      setCreating(false)
      nav(`/admin/livros/${book.id}`)
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = (b) => {
    if (window.confirm(`Excluir o livro "${b.title}"? Isso não pode ser desfeito.`)) deleteBook(b.id)
  }

  const dropOn = (e, shelfId, beforeId = null) => {
    e.preventDefault()
    e.stopPropagation()
    const id = e.dataTransfer.getData('text/plain')
    setOver(null)
    if (id && id !== beforeId) moveBook(id, shelfId, beforeId)
  }

  return (
    <section>
      <div className="adm-bar">
        <h2>Livros</h2>
        <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
          Criar livro
        </Button>
      </div>
      <p className="adm-muted">Arraste um livro para outra estante (ou para cima de outro livro) para movê-lo.</p>

      {shelves.map((s) => {
        const list = booksOfShelf(s.id)
        return (
          <div
            key={s.id}
            className={'adm-group' + (over === s.id ? ' over' : '')}
            onDragOver={(e) => {
              e.preventDefault()
              setOver(s.id)
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOver(null)
            }}
            onDrop={(e) => dropOn(e, s.id)}
          >
            <h3>
              <span className="swatch sm" style={{ background: s.color }} /> {s.name}
            </h3>
            {!list.length && <p className="adm-muted">Estante vazia. Solte um livro aqui.</p>}
            <div className="book-grid">
              {list.map((b, i) => (
                <article
                  key={b.id}
                  className="adm-card book-card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', b.id)}
                  onDrop={(e) => dropOn(e, s.id, b.id)}
                >
                  <div className="book-card-top">
                    <div className="thumb">
                      <BookCover book={b} />
                    </div>
                    <div className="grow">
                      <strong>{b.displayTitle || b.title}</strong>
                      {b.displayTitle && <div className="adm-muted">{b.title}</div>}
                      <div className="adm-muted">Posição {i + 1} · {b.chapters.length} cap.</div>
                    </div>
                  </div>
                  <div className="field mt">
                    <label>Estante</label>
                    <select className="input" value={b.shelfId} onChange={(e) => moveBook(b.id, e.target.value)}>
                      {shelves.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="adm-row wrap">
                    <Button className="btn icon" aria-label="Mover para a esquerda" disabled={i === 0} onClick={() => reorderBook(b.id, -1)} icon={ArrowUp} />
                    <Button className="btn icon" aria-label="Mover para a direita" disabled={i === list.length - 1} onClick={() => reorderBook(b.id, 1)} icon={ArrowDown} />
                    <Link className="btn" to={`/admin/livros/${b.id}`}>
                      <Pencil size={15} aria-hidden="true" /> Editar
                    </Link>
                    <Link className="btn" to={`/livro/${b.id}`} target="_blank" rel="noreferrer">
                      <ExternalLink size={15} aria-hidden="true" /> Abrir
                    </Link>
                    <Button variant="danger" icon={Trash2} onClick={() => remove(b)} aria-label="Excluir livro" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      })}

      {creating && (
        <Modal title="Criar livro" onClose={() => setCreating(false)}>
          <BookForm shelves={shelves} submitLabel="Criar livro" onSubmit={create} onCancel={() => setCreating(false)} />
        </Modal>
      )}
    </section>
  )
}
