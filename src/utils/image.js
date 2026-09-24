// Redimensiona e comprime a imagem antes de salvar (localStorage tem ~5 MB).
export function fileToDataUrl(file, { maxW = 1200, maxH = 1200, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      return reject(new Error('Use uma imagem PNG, JPG ou WEBP.'))
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const r = Math.min(1, maxW / img.width, maxH / img.height)
      const w = Math.max(1, Math.round(img.width * r))
      const h = Math.max(1, Math.round(img.height * r))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      let out = canvas.toDataURL('image/webp', quality)
      if (!out.startsWith('data:image/webp')) out = canvas.toDataURL('image/jpeg', quality)
      resolve(out)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível ler essa imagem.'))
    }
    img.src = url
  })
}
