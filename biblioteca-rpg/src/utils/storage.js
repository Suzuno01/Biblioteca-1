// Camada de armazenamento (localStorage).
// Para migrar para Supabase, troque as implementações de read/write por chamadas
// ao banco e mantenha a mesma interface (ver README).
const PREFIX = 'biblioteca:'
const cache = new Map()
const listeners = new Set()
let version = 0

const emit = () => {
  version++
  listeners.forEach((l) => l())
}

export const storage = {
  read(key, fallback) {
    if (cache.has(key)) return cache.get(key)
    let value = fallback
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw !== null) value = JSON.parse(raw)
    } catch {
      /* dados corrompidos: usa o fallback */
    }
    cache.set(key, value)
    return value
  },
  write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      throw new Error(
        'Não foi possível salvar: o armazenamento do navegador está cheio. Use imagens menores ou exporte um backup e remova conteúdo.'
      )
    }
    cache.set(key, value)
    emit()
  },
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getVersion() {
    return version
  },
}

// Mudanças feitas em outra aba
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith(PREFIX)) {
    cache.delete(e.key.slice(PREFIX.length))
    emit()
  }
})
