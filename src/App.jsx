import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useLibrary } from './hooks/useLibrary'
import Home from './pages/Home'
import Library from './pages/Library'
import ShelfPage from './pages/ShelfPage'
import BookPreview from './pages/BookPreview'
import Reader from './pages/Reader'
import Admin from './pages/Admin'
import ShelfManager from './components/Admin/ShelfManager'
import BookManager from './components/Admin/BookManager'
import BookEditor from './components/Admin/BookEditor'
import SettingsPanel from './components/Admin/SettingsPanel'

export default function App() {
  const { settings } = useLibrary()
  const { pathname } = useLocation()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = settings.theme
    root.style.setProperty('--accent', settings.mainColor)
    document.title = settings.libraryName
  }, [settings.theme, settings.mainColor, settings.libraryName])

  // Troca de "sala" = pequeno fade. Mudar de capítulo não recarrega a sala.
  const roomKey = pathname.startsWith('/admin') ? 'admin' : pathname.split('/').slice(0, 4).join('/')

  return (
    <div className="page" key={roomKey}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biblioteca" element={<Library />} />
        <Route path="/estante/:id" element={<ShelfPage />} />
        <Route path="/livro/:id" element={<BookPreview />} />
        <Route path="/livro/:id/ler/:chapter?" element={<Reader />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="estantes" replace />} />
          <Route path="estantes" element={<ShelfManager />} />
          <Route path="livros" element={<BookManager />} />
          <Route path="livros/:id" element={<BookEditor />} />
          <Route path="config" element={<SettingsPanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
