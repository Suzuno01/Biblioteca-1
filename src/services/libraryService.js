// Serviço de dados da biblioteca. Toda leitura/escrita passa por `storage`.
// Chaves separadas: library, shelves, books, settings.
import { storage } from '../utils/storage'
import { DEFAULT_APPEARANCE } from '../utils/bookStyle'
import { buildSeed } from './seed'

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`

export const DEFAULT_SETTINGS = {
  libraryName: 'A Biblioteca',
  tagline: 'Escolha um volume.',
  mainColor: '#c9a962',
  backgroundImage: '',
  theme: 'escuro', // escuro | penumbra
}

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0)
const nextOrder = (list) => (list.length ? Math.max(...list.map((x) => x.order ?? 0)) + 1 : 0)
const readShelves = () => storage.read('shelves', [])
const readBooks = () => storage.read('books', [])
const renumber = (list) => list.map((x, i) => ({ ...x, order: i }))

function renumberShelf(books, shelfId) {
  const ordered = books.filter((b) => b.shelfId === shelfId).sort(byOrder)
  const map = new Map(ordered.map((b, i) => [b.id, i]))
  return books.map((b) => (map.has(b.id) ? { ...b, order: map.get(b.id) } : b))
}

// ---------- inicialização ----------
export function ensureSeed() {
  if (storage.read('library', null)) return
  const seed = buildSeed()
  storage.write('books', seed.books)
  storage.write('shelves', seed.shelves)
  storage.write('settings', { ...DEFAULT_SETTINGS })
  storage.write('library', { version: 1, createdAt: new Date().toISOString() })
}

// ---------- estantes ----------
export function createShelf(data = {}) {
  const shelves = readShelves()
  const shelf = { id: uid(), name: 'Nova estante', color: '#172A46', description: '', icon: '', order: nextOrder(shelves), ...data }
  storage.write('shelves', [...shelves, shelf])
  return shelf
}

export function updateShelf(id, patch) {
  storage.write('shelves', readShelves().map((s) => (s.id === id ? { ...s, ...patch, id } : s)))
}

// Exclui a estante e os livros que estão nela.
export function deleteShelf(id) {
  storage.write('books', readBooks().filter((b) => b.shelfId !== id))
  storage.write('shelves', renumber(readShelves().filter((s) => s.id !== id).sort(byOrder)))
}

export function moveShelf(id, dir) {
  const list = [...readShelves()].sort(byOrder)
  const i = list.findIndex((s) => s.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
  storage.write('shelves', renumber(list))
}

// ---------- livros ----------
export function createBook(data = {}) {
  const books = readBooks()
  const shelfId = data.shelfId ?? [...readShelves()].sort(byOrder)[0]?.id
  const book = {
    id: uid(),
    title: 'Novo livro',
    displayTitle: '',
    cover: '',
    coverColor: '#1c2f4f',
    coverFont: 'cinzel',
    spineColor: '#243b63',
    chapters: [{ id: uid(), title: 'Primeiro capítulo', content: '' }],
    appearance: { ...DEFAULT_APPEARANCE },
    order: nextOrder(books.filter((b) => b.shelfId === shelfId)),
    createdAt: new Date().toISOString(),
    ...data,
    shelfId,
  }
  storage.write('books', [...books, book])
  return book
}

export function updateBook(id, patch) {
  storage.write(
    'books',
    readBooks().map((b) =>
      b.id === id ? { ...b, ...patch, id, appearance: { ...b.appearance, ...(patch.appearance || {}) } } : b
    )
  )
}

export function deleteBook(id) {
  const books = readBooks()
  const b = books.find((x) => x.id === id)
  if (!b) return
  storage.write('books', renumberShelf(books.filter((x) => x.id !== id), b.shelfId))
}

// Move o livro para outra estante (ou reposiciona na mesma). Sem beforeId, vai para o fim.
export function moveBook(id, shelfId, beforeId = null) {
  const books = readBooks()
  const b = books.find((x) => x.id === id)
  if (!b) return
  const from = b.shelfId
  const rest = books.filter((x) => x.id !== id)
  const list = rest.filter((x) => x.shelfId === shelfId).sort(byOrder)
  const at = beforeId ? list.findIndex((x) => x.id === beforeId) : -1
  list.splice(at < 0 ? list.length : at, 0, { ...b, shelfId })
  const map = new Map(list.map((x, i) => [x.id, i]))
  let next = [...rest.filter((x) => x.shelfId !== shelfId), ...list].map((x) =>
    map.has(x.id) ? { ...x, order: map.get(x.id) } : x
  )
  if (from !== shelfId) next = renumberShelf(next, from)
  storage.write('books', next)
}

export function reorderBook(id, dir) {
  const books = readBooks()
  const b = books.find((x) => x.id === id)
  if (!b) return
  const list = books.filter((x) => x.shelfId === b.shelfId).sort(byOrder)
  const i = list.findIndex((x) => x.id === id)
  const j = i + dir
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
  const map = new Map(list.map((x, k) => [x.id, k]))
  storage.write('books', books.map((x) => (map.has(x.id) ? { ...x, order: map.get(x.id) } : x)))
}

// ---------- capítulos ----------
const mapBook = (bookId, fn) => storage.write('books', readBooks().map((b) => (b.id === bookId ? fn(b) : b)))

export function createChapter(bookId, data = {}) {
  const chapter = { id: uid(), title: 'Novo capítulo', content: '', ...data }
  mapBook(bookId, (b) => ({ ...b, chapters: [...b.chapters, chapter] }))
  return chapter
}

export function updateChapter(bookId, chapterId, patch) {
  mapBook(bookId, (b) => ({
    ...b,
    chapters: b.chapters.map((c) => (c.id === chapterId ? { ...c, ...patch, id: chapterId } : c)),
  }))
}

export function deleteChapter(bookId, chapterId) {
  mapBook(bookId, (b) => ({ ...b, chapters: b.chapters.filter((c) => c.id !== chapterId) }))
}

export function moveChapter(bookId, chapterId, dir) {
  mapBook(bookId, (b) => {
    const l = [...b.chapters]
    const i = l.findIndex((c) => c.id === chapterId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= l.length) return b
    ;[l[i], l[j]] = [l[j], l[i]]
    return { ...b, chapters: l }
  })
}

// ---------- configurações ----------
export function updateSettings(patch) {
  storage.write('settings', { ...DEFAULT_SETTINGS, ...storage.read('settings', {}), ...patch })
}

// ---------- backup ----------
export function exportAll() {
  return {
    app: 'biblioteca-rpg',
    version: 1,
    exportedAt: new Date().toISOString(),
    library: storage.read('library', { version: 1 }),
    shelves: readShelves(),
    books: readBooks(),
    settings: { ...DEFAULT_SETTINGS, ...storage.read('settings', {}) },
  }
}

export function parseBackup(d) {
  if (!d || d.app !== 'biblioteca-rpg' || !Array.isArray(d.shelves) || !Array.isArray(d.books)) {
    throw new Error('Este arquivo não parece ser um backup da Biblioteca.')
  }
  const shelves = d.shelves.map((s, i) => ({
    id: s.id || uid(),
    name: String(s.name || 'Sem nome'),
    color: s.color || '#172A46',
    description: s.description || '',
    icon: s.icon || '',
    order: Number.isFinite(s.order) ? s.order : i,
  }))
  const ids = new Set(shelves.map((s) => s.id))
  const books = d.books
    .filter((b) => ids.has(b.shelfId))
    .map((b, i) => ({
      ...b,
      id: b.id || uid(),
      title: String(b.title || 'Sem título'),
      displayTitle: b.displayTitle || '',
      cover: b.cover || '',
      coverColor: b.coverColor || '#1c2f4f',
      coverFont: b.coverFont || 'cinzel',
      spineColor: b.spineColor || '#243b63',
      chapters: (Array.isArray(b.chapters) ? b.chapters : []).map((c) => ({
        id: c.id || uid(),
        title: String(c.title || 'Sem título'),
        content: String(c.content || ''),
      })),
      appearance: { ...DEFAULT_APPEARANCE, ...(b.appearance || {}) },
      order: Number.isFinite(b.order) ? b.order : i,
    }))
  return { shelves, books, settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) } }
}

export function importAll({ shelves, books, settings }) {
  storage.write('books', books)
  storage.write('shelves', shelves)
  storage.write('settings', settings)
  storage.write('library', { version: 1, importedAt: new Date().toISOString() })
}
