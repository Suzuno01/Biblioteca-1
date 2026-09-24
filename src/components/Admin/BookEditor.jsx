import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import BookForm from './BookForm'
import ChapterEditor from './ChapterEditor'
import AppearanceEditor from './AppearanceEditor'
import { useLibrary } from '../../hooks/useLibrary'
import { moveBook, updateBook } from '../../services/libraryService'

const TABS = [
  ['dados', 'Dados e capa'],
  ['capitulos', 'Capítulos'],
  ['aparencia', 'Aparência'],
]

export default function BookEditor() {
  const { id } = useParams()
  const { getBook, shelves } = useLibrary()
  const [tab, setTab] = useState('dados')
  const [saved, setSaved] = useState(false)
  const book = getBook(id)

  if (!book) {
    return (
      <p className="adm-muted">
        Livro não encontrado. <Link to="/admin/livros">Voltar para Livros</Link>
      </p>
    )
  }

  const submit = (values) => {
    try {
      const { shelfId, ...rest } = values
      updateBook(book.id, rest)
      if (shelfId !== book.shelfId) moveBook(book.id, shelfId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <section>
      <div className="adm-bar">
        <div>
          <Link className="adm-back" to="/admin/livros">
            <ChevronLeft size={15} aria-hidden="true" /> Livros
          </Link>
          <h2>{book.title}</h2>
        </div>
        <Link className="btn" to={`/livro/${book.id}/ler`} target="_blank" rel="noreferrer">
          <ExternalLink size={15} aria-hidden="true" /> Ler como jogador
        </Link>
      </div>

      <div className="adm-subtabs" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'dados' && (
        <>
          <BookForm key={book.id} initial={book} shelves={shelves} submitLabel="Salvar alterações" onSubmit={submit} />
          {saved && <p className="adm-ok">Alterações salvas.</p>}
        </>
      )}
      {tab === 'capitulos' && <ChapterEditor book={book} />}
      {tab === 'aparencia' && <AppearanceEditor key={book.id} book={book} />}
    </section>
  )
}
