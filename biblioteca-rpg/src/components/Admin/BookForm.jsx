import { useState } from 'react'
import BookCover from '../Book/BookCover'
import BookSpine from '../Library/BookSpine'
import ColorPicker from '../UI/ColorPicker'
import FontSelector from '../UI/FontSelector'
import ImageUploader from '../UI/ImageUploader'
import Button from '../UI/Button'

const BASE = {
  title: '',
  displayTitle: '',
  shelfId: '',
  cover: '',
  coverColor: '#1c2f4f',
  coverFont: 'cinzel',
  spineColor: '#243b63',
}

// Formulário de dados do livro (usado ao criar e ao editar).
export default function BookForm({ initial, shelves, onSubmit, submitLabel = 'Salvar', onCancel }) {
  const [v, setV] = useState(() => {
    const start = { ...BASE, shelfId: shelves[0]?.id || '' }
    if (initial) for (const k of Object.keys(BASE)) start[k] = initial[k] ?? start[k]
    return start
  })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))

  const submit = (e) => {
    e.preventDefault()
    if (!v.title.trim()) return alert('Informe o título do livro.')
    onSubmit({ ...v, title: v.title.trim(), displayTitle: v.displayTitle.trim() })
  }

  const preview = { id: initial?.id || 'preview', ...v, title: v.title || 'Sem título', chapters: [] }

  return (
    <form onSubmit={submit} className="form-layout">
      <div>
        <div className="field">
          <label htmlFor="bk-title">Título</label>
          <input id="bk-title" type="text" className="input" value={v.title} autoFocus onChange={(e) => set('title')(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="bk-display">Nome exibido na estante</label>
          <input
            id="bk-display"
            type="text"
            className="input"
            value={v.displayTitle}
            placeholder="Se vazio, usa o título"
            onChange={(e) => set('displayTitle')(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="bk-shelf">Estante</label>
          <select id="bk-shelf" className="input" value={v.shelfId} onChange={(e) => set('shelfId')(e.target.value)}>
            {shelves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Capa</label>
          <ImageUploader value={v.cover} onChange={set('cover')} maxW={900} maxH={1350} label="Escolher imagem de capa" />
        </div>
        <div className="field">
          <label>Cor da capa</label>
          <ColorPicker value={v.coverColor} onChange={set('coverColor')} />
        </div>
        <div className="field">
          <label>Fonte do título na capa (quando não há imagem)</label>
          <FontSelector value={v.coverFont} onChange={set('coverFont')} />
        </div>
        <div className="field">
          <label>Cor da lombada</label>
          <ColorPicker value={v.spineColor} onChange={set('spineColor')} />
        </div>
        <div className="adm-row">
          <button type="submit" className="btn primary">
            {submitLabel}
          </button>
          {onCancel && <Button onClick={onCancel}>Cancelar</Button>}
        </div>
      </div>

      <aside className="form-preview" aria-label="Pré-visualização">
        <BookCover book={preview} />
        <div className="spine-prev">
          <BookSpine book={preview} preview />
        </div>
      </aside>
    </form>
  )
}
