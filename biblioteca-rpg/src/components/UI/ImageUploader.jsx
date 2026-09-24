import { useRef, useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import { fileToDataUrl } from '../../utils/image'

export default function ImageUploader({ value, onChange, maxW = 1000, maxH = 1500, label = 'Escolher imagem' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      onChange(await fileToDataUrl(file, { maxW, maxH }))
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="uploader">
      {value && <img className="uploader-prev" src={value} alt="Pré-visualização" />}
      <div className="adm-row">
        <button type="button" className="btn" disabled={busy} onClick={() => input.current.click()}>
          <ImageIcon size={15} aria-hidden="true" />
          {busy ? 'Processando…' : value ? 'Trocar imagem' : label}
        </button>
        {value && (
          <button type="button" className="btn danger" onClick={() => onChange('')}>
            Remover
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={pick} />
    </div>
  )
}
