import { fontStack } from './fonts'

export const DEFAULT_APPEARANCE = {
  pageBg: '#111827',
  textColor: '#e5e7eb',
  fontFamily: 'georgia',
  fontSize: 18,
  lineHeight: 1.7,
  pageWidth: 720,
  pageMargin: 48,
  texture: 'none', // none | paper | canvas
  headingFont: 'cinzel',
  headingSize: 32,
  headingColor: '#c9a962',
}

// Converte a aparência de um livro em variáveis CSS
export function pageVars(appearance) {
  const a = { ...DEFAULT_APPEARANCE, ...(appearance || {}) }
  return {
    '--pg-bg': a.pageBg,
    '--pg-text': a.textColor,
    '--pg-font': fontStack(a.fontFamily),
    '--pg-size': `${a.fontSize}px`,
    '--pg-lh': a.lineHeight,
    '--pg-width': `${a.pageWidth}px`,
    '--pg-margin': `${a.pageMargin}px`,
    '--pg-h-font': fontStack(a.headingFont),
    '--pg-h-size': `${a.headingSize}px`,
    '--pg-h-color': a.headingColor,
  }
}
