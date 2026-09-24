export const FONTS = [
  { id: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", serif' },
  { id: 'garamond', label: 'Garamond', stack: '"EB Garamond", Garamond, Georgia, serif' },
  { id: 'times', label: 'Times New Roman', stack: '"Times New Roman", Times, serif' },
  { id: 'inter', label: 'Inter', stack: 'Inter, system-ui, sans-serif' },
  { id: 'lora', label: 'Lora', stack: 'Lora, Georgia, serif' },
  { id: 'merriweather', label: 'Merriweather', stack: 'Merriweather, Georgia, serif' },
  { id: 'cinzel', label: 'Cinzel (títulos)', stack: 'Cinzel, "Times New Roman", serif' },
]

export const fontStack = (id) => (FONTS.find((f) => f.id === id) || FONTS[0]).stack
