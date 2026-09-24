# Biblioteca — RPG

Biblioteca virtual para apresentar livros e documentos nas sessões de RPG. O jogador entra, escolhe uma estante, escolhe um livro e lê. Só existe um administrador (você), em `/admin`.

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

## Painel do administrador

- Acesse `/admin` (o jogador não vê nenhum link para essa rota).
- Senha: defina em um arquivo `.env` na raiz:

  ```
  VITE_ADMIN_PASSWORD=sua-senha
  ```

  Sem `.env`, a senha padrão é `mestre`. **Troque antes de publicar.**
  Importante: como o site roda inteiro no navegador, essa senha é uma barreira de conveniência, não segurança real. Para proteção de verdade, use Supabase Auth (ou similar) na V2.

## O que existe no painel

- **Estantes**: criar, editar (nome, cor, descrição, ícone), reordenar, excluir.
- **Livros**: criar, editar, excluir, mover entre estantes (menu ou arrastando), ordenar dentro da estante.
- **Dados e capa**: título, nome exibido na estante, capa (PNG/JPG/WEBP) ou capa gerada, cor da capa, fonte da capa, cor da lombada.
- **Capítulos**: criar, renomear, reordenar, excluir, escrever com o editor (negrito, itálico, sublinhado, título, subtítulo, alinhamento, fonte, tamanho, cor, separador, imagens).
- **Imagens no texto**: clique na imagem dentro do editor para mudar largura, alinhar (esquerda/centro/direita) ou remover.
- **Aparência**: fundo, textura, largura, margem, fonte/tamanho/cor/espaçamento do texto e dos títulos — salva por livro.
- **Configurações**: nome da biblioteca, frase da entrada, cor principal, imagem de fundo, tema.
- **Backup**: Exportar biblioteca (JSON) e Importar biblioteca.

## Onde os dados ficam

No `localStorage` do navegador, em quatro chaves separadas: `biblioteca:library`, `biblioteca:shelves`, `biblioteca:books`, `biblioteca:settings`.

Isso significa que **os dados existem só no navegador em que você editou**. Se você publicar o site na Vercel, os jogadores verão a biblioteca de exemplo, não a sua. Nesta V1, o fluxo é: edite localmente, exporte o backup e use-o em outro navegador/computador com "Importar". Para que jogadores vejam o seu conteúdo em outro dispositivo, é preciso o banco de dados (próxima etapa).

Limite: o `localStorage` guarda cerca de 5 MB. As imagens são reduzidas e comprimidas automaticamente, mas muitos livros ilustrados podem encher o espaço. Exporte backups com frequência.

## Trocar localStorage por Supabase (depois)

Toda leitura/escrita passa por:

- `src/utils/storage.js` (interface `read`, `write`, `subscribe`)
- `src/services/libraryService.js` (`createShelf`, `updateBook`, `moveBook`, `createChapter`…)

Basta reescrever essas duas camadas com chamadas assíncronas ao banco (e mover as imagens para o Storage do Supabase, guardando só a URL). Os componentes e as telas continuam iguais.

## Publicar (GitHub + Vercel)

1. Suba o projeto no GitHub (`.env` já está no `.gitignore`).
2. Na Vercel, importe o repositório (preset Vite) e configure `VITE_ADMIN_PASSWORD` em *Environment Variables*.
3. O arquivo `vercel.json` já cuida das rotas (`/admin`, `/livro/...`).

## Estrutura

```
src/
  components/
    Library/  Shelf, BookSpine
    Book/     BookCover, BookPage, BookReader
    Admin/    AdminLayout, ShelfManager, BookManager, BookForm, BookEditor,
              ChapterEditor, RichEditor, AppearanceEditor, SettingsPanel
    UI/       Button, Modal, ColorPicker, ImageUploader, FontSelector
  pages/      Home, Library, ShelfPage, BookPreview, Reader, Admin
  hooks/      useLibrary (+ useShelves, useBooks), useDebounced, useWidth
  services/   libraryService, seed
  utils/      storage, exportData, importData, image, fonts, bookStyle, sanitize, helpers, icons
  styles/     global.css, admin.css
```

## Rotas

| Rota | O que é |
| --- | --- |
| `/` | Entrada |
| `/biblioteca` | Todas as estantes |
| `/estante/:id` | Uma estante em destaque |
| `/livro/:id` | Capa do livro |
| `/livro/:id/ler/:capitulo` | Leitor |
| `/admin` | Painel (com senha) |
