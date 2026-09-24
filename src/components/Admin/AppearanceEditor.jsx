import { useRef, useState } from 'react'
import BookPage from '../Book/BookPage'
import ColorPicker from '../UI/ColorPicker'
import FontSelector from '../UI/FontSelector'
import Button from '../UI/Button'
import { useDebounced } from '../../hooks/useDebounced'
import { updateBook } from '../../services/libraryService'
import { DEFAULT_APPEARANCE } from '../../utils/bookStyle'

const PRESETS = [
  { label: 'Noite', v: { pageBg: '#111827', textColor: '#e5e7eb', headingColor: '#c9a962', fontFamily: 'georgia', headingFont: 'cinzel', texture: 'none' } },
  { label: 'Pergaminho', v: { pageBg: '#E8DFC8', textColor: '#2b2118', headingColor: '#5b2a30', fontFamily: 'garamond', headingFont: 'cinzel', texture: 'paper' } },
  { label: 'Documento', v: { pageBg: '#f4f1ea', textColor: '#1d1d1f', headingColor: '#1f3a5f', fontFamily: 'times', headingFont: 'times', texture: 'canvas' } },
]

const SAMPLE = {
  title: 'Título do capítulo',
  content:
    '<p>Assim começa o texto do livro. Ajuste as cores, a fonte e as margens e veja o resultado aqui ao lado.</p><h2>Um subtítulo</h2><p>O documento continuava descrevendo a sala, a mesa e a luz que vinha de lugar nenhum.</p><hr class="sep"><p><i>Fim da amostra.</i></p>',
}

export default function AppearanceEditor({ book }) {
  const [ap, setAp] = useState({ ...DEFAULT_APPEARANCE, ...book.appearance })
  const latest = useRef(ap)
  const { call } = useDebounced(() => {
    try {
      updateBook(book.id, { appearance: latest.current })
    } catch (e) {
      alert(e.message)
    }
  }, 400)

  const set = (patch) => {
    latest.current = { ...latest.current, ...patch }
    setAp(latest.current)
    call()
  }

  const range = (key, label, min, max, step = 1, unit = '') => (
    <div className="field">
      <label htmlFor={`ap-${key}`}>
        {label}: {ap[key]}
        {unit}
      </label>
      <input id={`ap-${key}`} type="range" min={min} max={max} step={step} value={ap[key]} onChange={(e) => set({ [key]: Number(e.target.value) })} />
    </div>
  )

  return (
    <div className="ap-layout">
      <div>
        <div className="adm-row wrap mb">
          {PRESETS.map((p) => (
            <Button key={p.label} onClick={() => set(p.v)}>
              {p.label}
            </Button>
          ))}
        </div>

        <h3>Página</h3>
        <div className="field">
          <label>Cor do fundo</label>
          <ColorPicker value={ap.pageBg} onChange={(v) => set({ pageBg: v })} />
        </div>
        <div className="field">
          <label htmlFor="ap-tex">Textura</label>
          <select id="ap-tex" className="input" value={ap.texture} onChange={(e) => set({ texture: e.target.value })}>
            <option value="none">Nenhuma</option>
            <option value="paper">Papel</option>
            <option value="canvas">Tecido</option>
          </select>
        </div>
        {range('pageWidth', 'Largura', 480, 960, 10, 'px')}
        {range('pageMargin', 'Margem', 16, 96, 2, 'px')}

        <h3>Texto</h3>
        <div className="field">
          <label>Fonte</label>
          <FontSelector value={ap.fontFamily} onChange={(v) => set({ fontFamily: v })} />
        </div>
        {range('fontSize', 'Tamanho', 14, 28, 1, 'px')}
        {range('lineHeight', 'Espaçamento entre linhas', 1.3, 2.2, 0.05)}
        <div className="field">
          <label>Cor do texto</label>
          <ColorPicker value={ap.textColor} onChange={(v) => set({ textColor: v })} />
        </div>

        <h3>Títulos</h3>
        <div className="field">
          <label>Fonte</label>
          <FontSelector value={ap.headingFont} onChange={(v) => set({ headingFont: v })} />
        </div>
        {range('headingSize', 'Tamanho', 20, 56, 1, 'px')}
        <div className="field">
          <label>Cor</label>
          <ColorPicker value={ap.headingColor} onChange={(v) => set({ headingColor: v })} />
        </div>
        <p className="adm-muted">As mudanças são salvas automaticamente.</p>
      </div>

      <div className="ap-preview">
        <BookPage book={{ ...book, appearance: ap }} chapter={SAMPLE} number={1} total={2} />
      </div>
    </div>
  )
}
