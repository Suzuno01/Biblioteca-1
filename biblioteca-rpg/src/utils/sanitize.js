// Remove scripts e atributos perigosos do HTML dos capítulos (importações, colagens).
export function sanitizeHtml(html = '') {
  const doc = new DOMParser().parseFromString(String(html), 'text/html')
  doc.querySelectorAll('script,iframe,object,embed,link,meta,style,form').forEach((n) => n.remove())
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      const name = attr.name.toLowerCase()
      const bad = name.startsWith('on') || (['href', 'src', 'xlink:href'].includes(name) && /^\s*javascript:/i.test(attr.value))
      if (bad) el.removeAttribute(attr.name)
    }
  })
  return doc.body.innerHTML
}
