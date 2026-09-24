import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import Button from '../UI/Button'
import ColorPicker from '../UI/ColorPicker'
import ImageUploader from '../UI/ImageUploader'
import { useLibrary } from '../../hooks/useLibrary'
import { updateSettings } from '../../services/libraryService'
import { exportLibrary } from '../../utils/exportData'
import { importLibrary } from '../../utils/importData'

export default function SettingsPanel() {
  const { settings } = useLibrary()
  const [v, setV] = useState(settings)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)
  const set = (k) => (val) => {
    setV((s) => ({ ...s, [k]: val }))
    setSaved(false)
  }

  const save = (e) => {
    e.preventDefault()
    try {
      updateSettings({ ...v, libraryName: v.libraryName.trim() || 'A Biblioteca' })
      setSaved(true)
    } catch (err) {
      alert(err.message)
    }
  }

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const done = await importLibrary(file, (msg) => window.confirm(msg))
      if (done) window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section>
      <h2>Configurações</h2>
      <form onSubmit={save} className="narrow">
        <div className="field">
          <label htmlFor="st-name">Nome da biblioteca</label>
          <input id="st-name" type="text" className="input" value={v.libraryName} onChange={(e) => set('libraryName')(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="st-tag">Frase da entrada</label>
          <input id="st-tag" type="text" className="input" value={v.tagline} onChange={(e) => set('tagline')(e.target.value)} />
        </div>
        <div className="field">
          <label>Cor principal (detalhes dourados)</label>
          <ColorPicker value={v.mainColor} onChange={set('mainColor')} />
        </div>
        <div className="field">
          <label>Imagem de fundo</label>
          <ImageUploader value={v.backgroundImage} onChange={set('backgroundImage')} maxW={1920} maxH={1200} label="Escolher imagem de fundo" />
        </div>
        <div className="field">
          <label htmlFor="st-theme">Tema</label>
          <select id="st-theme" className="input" value={v.theme} onChange={(e) => set('theme')(e.target.value)}>
            <option value="escuro">Escuro (azul e preto)</option>
            <option value="penumbra">Penumbra (madeira e âmbar)</option>
          </select>
        </div>
        <div className="adm-row">
          <button type="submit" className="btn primary">
            Salvar configurações
          </button>
          {saved && <span className="adm-ok">Salvo.</span>}
        </div>
      </form>

      <h2 className="mt-lg">Backup</h2>
      <p className="adm-muted narrow">
        Os dados ficam neste navegador. Exporte um backup com frequência: ele contém estantes, livros, capítulos, imagens e configurações.
      </p>
      <div className="adm-row wrap">
        <Button icon={Download} onClick={exportLibrary}>
          Exportar biblioteca
        </Button>
        <Button icon={Upload} onClick={() => fileRef.current.click()}>
          Importar biblioteca
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
      </div>
    </section>
  )
}
