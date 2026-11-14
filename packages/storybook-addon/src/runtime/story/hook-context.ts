import { createContext } from 'unctx'

/** The canvas of the running story */
export const hookContext = createContext<EventTarget>()

export function hookCanvas(): EventTarget | undefined {
  return hookContext.tryUse() ?? undefined
}
