import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLibrary } from '../hooks/useLibrary'

export default function Home() {
  const { settings } = useLibrary()
  const nav = useNavigate()
  const [leaving, setLeaving] = useState(false)

  const enter = () => {
    setLeaving(true)
    setTimeout(() => nav('/biblioteca'), 450)
  }

  const bg = settings.backgroundImage
    ? { backgroundImage: `linear-gradient(rgba(3,6,12,.68),rgba(3,6,12,.9)), url("${settings.backgroundImage}")` }
    : undefined

  return (
    <main className={'home' + (leaving ? ' leaving' : '')} style={bg}>
      {!settings.backgroundImage && (
        <>
          <div className="home-side left" />
          <div className="home-side right" />
        </>
      )}
      <div className="home-inner">
        <h1>{settings.libraryName}</h1>
        <i className="ornament" />
        <p className="tagline">“{settings.tagline}”</p>
        <button type="button" className="btn-gold" onClick={enter}>
          Entrar
        </button>
      </div>
    </main>
  )
}
