import { parseBackup, importAll } from '../services/libraryService'

// Lê o arquivo, valida, pede confirmação e substitui a biblioteca atual.
// Retorna true se importou, false se o usuário cancelou.
export async function importLibrary(file, confirmFn = () => true) {
  let data
  try {
    data = JSON.parse(await file.text())
  } catch {
    throw new Error('O arquivo não é um JSON válido.')
  }
  const parsed = parseBackup(data)
  const msg = `Substituir toda a biblioteca atual por este backup (${parsed.shelves.length} estantes, ${parsed.books.length} livros)? Isso não pode ser desfeito.`
  if (!confirmFn(msg)) return false
  importAll(parsed)
  return true
}
