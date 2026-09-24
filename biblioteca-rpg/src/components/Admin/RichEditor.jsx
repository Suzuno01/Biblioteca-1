import { useEffect, useRef, useState } from 'react'
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Heading2,
  ImagePlus, Italic, Minus, Pilcrow, Trash2, Underline,
} from 'lucide-react'
import { FONTS } from '../../utils/fonts'
import { pageVars } from '../../utils/bookStyle'
import { fileToDataUrl } from '../../utils/image'
import { sanitizeHtml } from '../../utils/sanitize'
import { useDebounced } from '../../hooks/useDebounced'

const SIZES = [14, 16, 18, 20, 22, 24, 28, 32, 40, 48]

// HTML limpo (sem a marca de seleção de imagem)
function serialize(el) {
  if (!el) return ''
  const clone = el.cloneNode(true)
  clone.querySelectorAll('.sel').forEach((n) => {
    n.classList.remove('sel')
    if (!n.getAttribute('class')) n.removeAttribute('class')
  })
  return clone.innerHTML
}

// Editor de texto simples (contentEditable) que mostra a página com a aparência do livro.
export default function RichEditor({ book, initial, onChange }) {
  const ref = useRef(null)
  const lastEl = useRef(null)
  const saved = useRef(null) // última seleção dentro do editor
  const fileRef = useRef(null)
  const colorRef = useRef(null)
  const figEl = useRef(null)
  const [fig, setFig] = useState(null) // { width, align } da imagem selecionada

  const { call } = useDebounced(() => onChange(serialize(ref.current || lastEl.current)), 600)

  useEffect(() => {
    const el = ref.current
    lastEl.current = el
    el.innerHTML = sanitizeHtml(initial)
    document.execCommand('defaultParagraphSeparator', false, 'p')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Guarda a seleção para que selects/inputs da barra não a percam
  useEffect(() => {
    const onSel = () => {
      const s = document.getSelection()
      if (s.rangeCount && ref.current?.contains(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange()
    }
    document.addEventListener('selectionchange', onSel)
    return () => document.removeEventListener('selectionchange', onSel)
  }, [])

  const restore = () => {
    const el = ref.current
    el.focus()
    const s = window.getSelection()
    if (saved.current) {
      s.removeAllRanges()
      s.addRange(saved.current)
    } else {
      const r = document.createRange()
      r.selectNodeContents(el)
      r.collapse(false)
      s.removeAllRanges()
      s.addRange(r)
    }
  }

  const exec = (cmd, value = null) => {
    restore()
    document.execCommand(cmd, false, value)
    call()
  }

  // Aplica estilo (fonte, tamanho, cor) ao trecho selecionado
  const applyStyle = (css) => {
    restore()
    const s = window.getSelection()
    if (!s.rangeCount || s.isCollapsed) return alert('Selecione um trecho do texto primeiro.')
    const box = document.createElement('div')
    box.appendChild(s.getRangeAt(0).cloneContents())
    document.execCommand('insertHTML', false, `<span style="${css.replace(/"/g, "'")}">${box.innerHTML}</span>`)
    call()
  }

  useEffect(() => {
    const el = colorRef.current
    const onColor = (e) => applyStyle(`color:${e.target.value}`)
    el.addEventListener('change', onColor)
    return () => el.removeEventListener('change', onColor)
  })

  const addImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const src = await fileToDataUrl(file, { maxW: 1400, maxH: 1400 })
      restore()
      document.execCommand(
        'insertHTML',
        false,
        `<figure class="fig fig-center" style="width:60%" contenteditable="false"><img src="${src}" alt=""></figure><p><br></p>`
      )
      call()
    } catch (err) {
      alert(err.message)
    }
  }

  // Seleção / edição de imagens
  const onClick = (e) => {
    const root = ref.current
    root.querySelectorAll('.sel').forEach((n) => n.classList.remove('sel'))
    const f = e.target.closest?.('figure.fig')
    if (f && root.contains(f)) {
      f.classList.add('sel')
      figEl.current = f
      setFig({
        width: parseInt(f.style.width, 10) || 60,
        align: ['left', 'right'].find((a) => f.classList.contains(`fig-${a}`)) || 'center',
      })
    } else {
      figEl.current = null
      setFig(null)
    }
  }
  const setWidth = (w) => {
    figEl.current.style.width = `${w}%`
    setFig((v) => ({ ...v, width: w }))
    call()
  }
  const setAlign = (a) => {
    figEl.current.classList.remove('fig-left', 'fig-center', 'fig-right')
    figEl.current.classList.add(`fig-${a}`)
    setFig((v) => ({ ...v, align: a }))
    call()
  }
  const removeFig = () => {
    figEl.current.remove()
    figEl.current = null
    setFig(null)
    call()
  }

  const onPaste = (e) => {
    e.preventDefault()
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
  }

  const tb = (icon, label, action) => {
    const Icon = icon
    return (
      <button type="button" className="btn icon" title={label} aria-label={label} onClick={action}>
        <Icon size={16} aria-hidden="true" />
      </button>
    )
  }

  const ap = book.appearance || {}

  return (
    <div>
      <div
        className="toolbar"
        role="toolbar"
        aria-label="Formatação"
        onMouseDown={(e) => {
          if (!['SELECT', 'INPUT', 'LABEL'].includes(e.target.tagName)) e.preventDefault()
        }}
      >
        {tb(Bold, 'Negrito', () => exec('bold'))}
        {tb(Italic, 'Itálico', () => exec('italic'))}
        {tb(Underline, 'Sublinhado', () => exec('underline'))}
        <span className="tsep" />
        {tb(Heading1, 'Título', () => exec('formatBlock', 'h1'))}
        {tb(Heading2, 'Subtítulo', () => exec('formatBlock', 'h2'))}
        {tb(Pilcrow, 'Texto normal', () => exec('formatBlock', 'p'))}
        <span className="tsep" />
        {tb(AlignLeft, 'Alinhar à esquerda', () => exec('justifyLeft'))}
        {tb(AlignCenter, 'Centralizar', () => exec('justifyCenter'))}
        {tb(AlignRight, 'Alinhar à direita', () => exec('justifyRight'))}
        {tb(AlignJustify, 'Justificar', () => exec('justifyFull'))}
        <span className="tsep" />
        <select
          className="input tsel"
          aria-label="Fonte"
          defaultValue=""
          onChange={(e) => {
            const f = FONTS.find((x) => x.id === e.target.value)
            if (f) applyStyle(`font-family:${f.stack}`)
            e.target.value = ''
          }}
        >
          <option value="">Fonte</option>
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          className="input tsel"
          aria-label="Tamanho da fonte"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) applyStyle(`font-size:${e.target.value}px`)
            e.target.value = ''
          }}
        >
          <option value="">Tamanho</option>
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="tcolor" title="Cor da fonte">
          Cor
          <input ref={colorRef} type="color" defaultValue="#c9a962" />
        </label>
        <span className="tsep" />
        <button type="button" className="btn" onClick={() => fileRef.current.click()}>
          <ImagePlus size={16} aria-hidden="true" /> Imagem
        </button>
        <button type="button" className="btn" onClick={() => exec('insertHTML', '<hr class="sep"><p><br></p>')}>
          <Minus size={16} aria-hidden="true" /> Separador
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={addImage} />
      </div>

      {fig && (
        <div className="toolbar fig-bar">
          <span className="adm-muted">Imagem selecionada</span>
          <label className="adm-row tight">
            Largura
            <input type="range" min="10" max="100" value={fig.width} onChange={(e) => setWidth(Number(e.target.value))} />
            <span className="adm-muted">{fig.width}%</span>
          </label>
          <span className="tsep" />
          {['left', 'center', 'right'].map((a) => (
            <button key={a} type="button" className={'btn' + (fig.align === a ? ' primary' : '')} onClick={() => setAlign(a)}>
              {{ left: 'Esquerda', center: 'Centro', right: 'Direita' }[a]}
            </button>
          ))}
          <button type="button" className="btn danger" onClick={removeFig}>
            <Trash2 size={15} aria-hidden="true" /> Remover
          </button>
        </div>
      )}

      <div className="editor-wrap">
        <article className={`book-page editing tex-${ap.texture || 'none'}`} style={pageVars(ap)}>
          <div
            ref={ref}
            className="book-content"
            contentEditable
            suppressContentEditableWarning
            spellCheck
            data-placeholder="Escreva aqui…"
            onInput={call}
            onClick={onClick}
            onPaste={onPaste}
          />
        </article>
      </div>
    </div>
  )
}
