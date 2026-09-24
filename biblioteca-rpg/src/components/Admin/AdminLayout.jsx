import { Link, NavLink, Outlet } from 'react-router-dom'
import { Eye, LogOut } from 'lucide-react'

export default function AdminLayout({ onLogout }) {
  return (
    <div className="adm">
      <header className="adm-top">
        <h1 className="adm-title">Administração</h1>
        <nav className="adm-tabs">
          <NavLink to="estantes">Estantes</NavLink>
          <NavLink to="livros">Livros</NavLink>
          <NavLink to="config">Configurações</NavLink>
        </nav>
        <div className="adm-row">
          <Link className="btn" to="/biblioteca" target="_blank" rel="noreferrer">
            <Eye size={15} aria-hidden="true" /> Ver biblioteca
          </Link>
          <button type="button" className="btn" onClick={onLogout}>
            <LogOut size={15} aria-hidden="true" /> Sair
          </button>
        </div>
      </header>
      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  )
}
