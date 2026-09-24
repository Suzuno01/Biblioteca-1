import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import Button from '../UI/Button'
import Modal from '../UI/Modal'
import ColorPicker from '../UI/ColorPicker'
import { useLibrary } from '../../hooks/useLibrary'
import { createShelf, deleteShelf, moveShelf, updateShelf } from '../../services/libraryService'
import { SHELF_ICONS, ShelfIcon } from '../../utils/icons'

function ShelfForm({ initial, onSubmit, onCancel }) {
  const [v, setV] = useState({ name: '', color: '#172A46', description: '', icon: '', ...initial })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  const submit = (e) => {
    e.preventDefault()
    if (!v.name.trim()) return alert('Informe o nome da estante.')
    onSubmit({ ...v, name: v.name.trim() })
  }
  return (
    <form onSubmit={submit}>
      <div className="field">
        <label htmlFor="sh-name">Nome</label>
        <input id="sh-name" type="text" className="input" value={v.name} autoFocus onChange={(e) => set('name')(e.target.value)} />
      </div>
      <div className="field">
        <label>Cor</label>
        <ColorPicker value={v.color} onChange={set('color')} />
      </div>
      <div className="field">
        <label htmlFor="sh-desc">Descrição (opcional)</label>
        <textarea id="sh-desc" className="input" rows={3} value={v.description} onChange={(e) => set('description')(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="sh-icon">Ícone (opcional)</label>
        <select id="sh-icon" className="input" value={v.icon} onChange={(e) => set('icon')(e.target.value)}>
          <option value="">Nenhum</option>
          {Object.entries(SHELF_ICONS).map(([k, i]) => (
            <option key={k} value={k}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div className="adm-row">
        <button type="submit" className="btn primary">
          Salvar
        </button>
        <Button onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}

export default function ShelfManager() {
  const { shelves, booksOfShelf } = useLibrary()
  const [editing, setEditing] = useState(null) // null | 'new' | shelf

  const save = (data) => {
    try {
      if (editing === 'new') createShelf(data)
      else updateShelf(editing.id, data)
      setEditing(null)
    } catch (e) {
      alert(e.message)
    }
  }

  const remove = (s) => {
    const n = booksOfShelf(s.id).length
    const msg = n
      ? `Excluir a estante "${s.name}" e os ${n} livro(s) dentro dela? Isso não pode ser desfeito.`
      : `Excluir a estante "${s.name}"?`
    if (window.confirm(msg)) deleteShelf(s.id)
  }

  return (
    <section>
      <div className="adm-bar">
        <h2>Estantes</h2>
        <Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>
          Nova estante
        </Button>
      </div>

      {!shelves.length && <p className="adm-muted">Nenhuma estante ainda. Crie a primeira.</p>}

      <div className="adm-list">
        {shelves.map((s, i) => (
          <article key={s.id} className="adm-card adm-row">
            <span className="swatch" style={{ background: s.color }} />
            <div className="grow">
              <strong className="adm-name">
                <ShelfIcon name={s.icon} size={15} /> {s.name}
              </strong>
              <div className="adm-muted">
                {s.color} · {booksOfShelf(s.id).length} livro(s)
              </div>
            </div>
            <div className="adm-row">
              <Button className="btn icon" aria-label="Subir" disabled={i === 0} onClick={() => moveShelf(s.id, -1)} icon={ArrowUp} />
              <Button className="btn icon" aria-label="Descer" disabled={i === shelves.length - 1} onClick={() => moveShelf(s.id, 1)} icon={ArrowDown} />
              <Button icon={Pencil} onClick={() => setEditing(s)}>
                Editar
              </Button>
              <Link className="btn" to={`/estante/${s.id}`} target="_blank" rel="noreferrer">
                <ExternalLink size={15} aria-hidden="true" /> Abrir
              </Link>
              <Button variant="danger" icon={Trash2} onClick={() => remove(s)}>
                Excluir
              </Button>
            </div>
          </article>
        ))}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Nova estante' : 'Editar estante'} onClose={() => setEditing(null)}>
          <ShelfForm initial={editing === 'new' ? undefined : editing} onSubmit={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </section>
  )
}
