import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import Button from '../UI/Button'
import RichEditor from './RichEditor'
import { createChapter, deleteChapter, moveChapter, updateChapter } from '../../services/libraryService'

function ChapterTitle({ bookId, chapter }) {
  const [title, setTitle] = useState(chapter.title)
  const commit = () => {
    const t = title.trim() || 'Sem título'
    if (t !== chapter.title) updateChapter(bookId, chapter.id, { title: t })
  }
  return (
    <div className="field">
      <label htmlFor="ch-title">Título do capítulo</label>
      <input
        id="ch-title"
        type="text"
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
    </div>
  )
}

export default function ChapterEditor({ book }) {
  const [selected, setSelected] = useState(book.chapters[0]?.id ?? null)
  const [status, setStatus] = useState('')
  const chapter = book.chapters.find((c) => c.id === selected) || book.chapters[0]

  const add = () => {
    try {
      const c = createChapter(book.id, { title: `Capítulo ${book.chapters.length + 1}` })
      setSelected(c.id)
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = (c) => {
    if (!window.confirm(`Excluir o capítulo "${c.title}"?`)) return
    deleteChapter(book.id, c.id)
    setSelected(null)
  }

  const saveContent = (html) => {
    try {
      updateChapter(book.id, chapter.id, { content: html })
      setStatus(`Salvo às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`)
    } catch (e) {
      setStatus('Erro ao salvar')
      alert(e.message)
    }
  }

  return (
    <div className="chap-layout">
      <aside className="chap-list">
        <Button variant="primary" icon={Plus} onClick={add}>
          Novo capítulo
        </Button>
        <ol>
          {book.chapters.map((c, i) => (
            <li key={c.id} className={c.id === chapter?.id ? 'on' : ''}>
              <button type="button" className="chap-pick" onClick={() => setSelected(c.id)}>
                <span className="chap-num">{String(i + 1).padStart(2, '0')}</span> {c.title}
              </button>
              <span className="adm-row tight">
                <Button className="btn icon" aria-label="Subir capítulo" disabled={i === 0} onClick={() => moveChapter(book.id, c.id, -1)} icon={ArrowUp} />
                <Button className="btn icon" aria-label="Descer capítulo" disabled={i === book.chapters.length - 1} onClick={() => moveChapter(book.id, c.id, 1)} icon={ArrowDown} />
                <Button className="btn icon danger" aria-label="Excluir capítulo" onClick={() => remove(c)} icon={Trash2} />
              </span>
            </li>
          ))}
        </ol>
      </aside>

      <div className="chap-main">
        {chapter ? (
          <>
            <ChapterTitle key={chapter.id + chapter.title} bookId={book.id} chapter={chapter} />
            <RichEditor key={chapter.id} book={book} initial={chapter.content} onChange={saveContent} />
            <p className="adm-muted">{status || 'As alterações são salvas automaticamente.'}</p>
          </>
        ) : (
          <p className="adm-muted">Este livro ainda não tem capítulos. Crie o primeiro.</p>
        )}
      </div>
    </div>
  )
}
