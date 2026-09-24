import { Scroll, BookOpen, Skull, Map as MapIcon, Swords, Flame, Feather, Key, Landmark, Gem, Users, Church } from 'lucide-react'

export const SHELF_ICONS = {
  scroll: { label: 'Pergaminho', C: Scroll },
  book: { label: 'Livro', C: BookOpen },
  skull: { label: 'Caveira', C: Skull },
  map: { label: 'Mapa', C: MapIcon },
  swords: { label: 'Espadas', C: Swords },
  flame: { label: 'Chama', C: Flame },
  feather: { label: 'Pena', C: Feather },
  key: { label: 'Chave', C: Key },
  landmark: { label: 'Monumento', C: Landmark },
  gem: { label: 'Gema', C: Gem },
  users: { label: 'Pessoas', C: Users },
  church: { label: 'Templo', C: Church },
}

export function ShelfIcon({ name, size = 16 }) {
  const I = SHELF_ICONS[name]?.C
  return I ? <I size={size} aria-hidden="true" /> : null
}
