// eslint-disable-next-line no-console
export const logger = { info: process.dev ? console.log : () => { } }

export function useLogger() {
  return logger
}
