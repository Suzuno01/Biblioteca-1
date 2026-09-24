export function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Cor de texto legível sobre um fundo
export function readableOn(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return '#f3ead3'
  const n = parseInt(m[1], 16)
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return lum > 0.6 ? '#1b1610' : '#f3ead3'
}

export function roman(n) {
  const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of t) while (n >= v) { out += s; n -= v }
  return out
}

// Tamanho "pseudo-aleatório" estável de cada livro na estante
export function dims(id) {
  const h = hash(String(id))
  return { w: 34 + (h % 21), h: 152 + ((h >> 5) % 46), lean: h % 11 === 0 }
}
