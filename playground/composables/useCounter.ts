import { useState } from '#imports'

export function useCounter(key = 'counter') {
  const count = useState(key, () => 0)

  function increment() {
    count.value++
  }

  return { count, increment }
}
