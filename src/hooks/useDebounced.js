import { useCallback, useEffect, useRef } from 'react'

// Agenda `fn` para rodar depois de `ms` sem novas chamadas.
// Ao desmontar o componente, executa a chamada pendente (para não perder edição).
export function useDebounced(fn, ms = 500) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  const timer = useRef(null)

  const flush = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
      fnRef.current()
    }
  }, [])

  const call = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      timer.current = null
      fnRef.current()
    }, ms)
  }, [ms])

  useEffect(() => flush, [flush])
  return { call, flush }
}
