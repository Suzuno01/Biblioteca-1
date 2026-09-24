import { DEFAULT_APPEARANCE } from '../utils/bookStyle'

// Conteúdo de exemplo da primeira execução. Pode ser apagado pelo painel /admin.
export function buildSeed() {
  const s1 = 'estante-documentos'
  const s2 = 'estante-historia'
  const dark = { ...DEFAULT_APPEARANCE }
  const parch = {
    ...DEFAULT_APPEARANCE,
    pageBg: '#E8DFC8',
    textColor: '#2b2118',
    headingColor: '#5b2a30',
    fontFamily: 'garamond',
    fontSize: 20,
    texture: 'paper',
  }
  const now = new Date().toISOString()
  const ch = (id, title, content) => ({ id, title, content })
  const book = (o, i) => ({ displayTitle: '', cover: '', coverFont: 'cinzel', appearance: dark, order: i, createdAt: now, ...o })

  const shelves = [
    { id: s1, name: 'Documentos Proibidos', color: '#172A46', description: 'Arquivos encontrados nos porões da instituição.', icon: 'scroll', order: 0 },
    { id: s2, name: 'História', color: '#2a1f16', description: 'Crônicas e registros de eras passadas.', icon: 'landmark', order: 1 },
  ]

  const books = [
    book({
      id: 'livro-relatorio',
      title: 'O Relatório Completo Sobre o Incidente da Ala Norte',
      displayTitle: 'Relatório — Ala Norte',
      shelfId: s1,
      coverColor: '#1c2f4f',
      spineColor: '#243b63',
      chapters: [
        ch('c1', 'Introdução', '<p>O documento começa descrevendo o incidente ocorrido naquela noite. Os registros foram reunidos às pressas, e muitas páginas estão manchadas.</p><p>Quem lê estas linhas já sabe que a Ala Norte foi lacrada. O que poucos sabem é <b>por quê</b>.</p><hr class="sep"><p><i>Anexo I — arquivado sob custódia do Conselho.</i></p>'),
        ch('c2', 'O Incidente', '<h2>A noite de inverno</h2><p>As luzes falharam às onze horas. Às onze e dez, ninguém mais respondia pelo rádio.</p><p>A partir daquele momento, nada voltou ao normal.</p>'),
      ],
    }, 0),
    book({
      id: 'livro-diario',
      title: 'Diário de Elowen Vasc',
      displayTitle: 'Diário — E. Vasc',
      shelfId: s1,
      coverColor: '#4a1f24',
      spineColor: '#5b2a30',
      appearance: parch,
      chapters: [ch('c1', 'Primeira anotação', '<p>Se você encontrou este caderno, saiba que não escrevo por vaidade. Escrevo para que alguém, algum dia, entenda o que aconteceu conosco.</p><p>A chave que trago no pescoço abre mais do que uma porta.</p>')],
    }, 1),
    book({
      id: 'livro-cronicas',
      title: 'Crônicas do Reino Esquecido',
      displayTitle: 'Crônicas do Reino',
      shelfId: s2,
      coverColor: '#2f4a3a',
      spineColor: '#3d5c49',
      appearance: parch,
      chapters: [
        ch('c1', 'A fundação', '<p>Antes das torres e das estradas, havia apenas o vale e o rio. Foi ali que os primeiros escribas assentaram suas pedras.</p>'),
        ch('c2', 'O silêncio', '<p>Ninguém sabe ao certo quando o reino deixou de ser lembrado. Os registros simplesmente terminam.</p>'),
      ],
    }, 0),
    book({
      id: 'livro-manual',
      title: 'Manual de Sobrevivência nas Catacumbas',
      displayTitle: 'Manual — Catacumbas',
      shelfId: s2,
      coverColor: '#3a2f1a',
      spineColor: '#54431f',
      chapters: [ch('c1', 'Regras básicas', '<p>Nunca siga uma luz que se move sozinha.</p><p>Nunca responda ao seu próprio nome vindo de dentro das paredes.</p>')],
    }, 1),
  ]
  return { shelves, books }
}
