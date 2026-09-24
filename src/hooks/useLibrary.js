import { useMemo, useSyncExternalStore } from 'react'
import { storage } from '../utils/storage'
import { DEFAULT_SETTINGS } from '../services/libraryService'

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)

// Lê estantes, livros e configurações e re-renderiza quando algo muda.
export function useLibrary() {
  const version = useSyncExternalStore(storage.subscribe, storage.getVersion, storage.getVersion)
  return useMemo(() => {
    const shelves = [...storage.read('shelves', [])].sort(byOrder)
    const books = [...storage.read('books', [])].sort(byOrder)
    const settings = { ...DEFAULT_SETTINGS, ...storage.read('settings', {}) }
    return {
      shelves,
      books,
      settings,
      getShelf: (id) => shelves.find((s) => s.id === id),
      getBook: (id) => books.find((b) => b.id === id),
      booksOfShelf: (shelfId) => books.filter((b) => b.shelfId === shelfId),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])
}

export const useShelves = () => {
  const { shelves, getShelf } = useLibrary()
  return { shelves, getShelf }
}

export const useBooks = () => {
  const { books, getBook, booksOfShelf } = useLibrary()
  return { books, getBook, booksOfShelf }
}
