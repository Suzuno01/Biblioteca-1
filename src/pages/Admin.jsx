import { useState } from 'react'
import AdminLayout from '../components/Admin/AdminLayout'

// Senha simples definida em .env (VITE_ADMIN_PASSWORD). Se não existir, usa "mestre".
// ATENÇÃO: é uma barreira de conveniência no navegador, não segurança de verdade.
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'mestre'
const KEY = 'biblioteca:admin'

export default function Admin() {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === '1')
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (pw === PASSWORD) {
      sessionStorage.setItem(KEY, '1')
      setOk(true)
    } else {
      setError(true)
    }
  }

  if (!ok) {
    return (
      <main className="adm gate">
        <form onSubmit={submit} className="gate-box">
          <h1 className="adm-title">Acesso restrito</h1>
          <div className="field">
            <label htmlFor="pw">Senha</label>
            <input
              id="pw"
              type="password"
              className="input"
              value={pw}
              autoFocus
              onChange={(e) => {
                setPw(e.target.value)
                setError(false)
              }}
            />
          </div>
          {error && <p className="adm-error">Senha incorreta.</p>}
          <button type="submit" className="btn primary">
            Entrar
          </button>
        </form>
      </main>
    )
  }

  return (
    <AdminLayout
      onLogout={() => {
        sessionStorage.removeItem(KEY)
        setOk(false)
      }}
    />
  )
}
