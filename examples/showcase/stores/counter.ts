const delay = (t: number) => new Promise((r) => setTimeout(r, t))

export const useCounter = defineStore('counter', {
  actions: {
    changeMe() {
      // Console.log('change me to test HMR')
    },

    async decrementToZero(interval = 300) {
      if (this.n <= 0) {
        return
      }

      while (this.n > 0) {
        this.$patch((state) => {
          state.n--
          state.decrementedTimes++
        })
        // oxlint-disable-next-line no-await-in-loop -- we want to wait between each decrement
        await delay(interval)
      }
    },

    async fail() {
      const { n } = this
      await delay(1000)
      this.numbers.push(n)
      await delay(1000)
      if (this.n !== n) {
        throw new Error('Someone changed n!')
      }

      return n
    },

    increment(amount = 1) {
      this.incrementedTimes++
      this.n += amount
    },
  },

  getters: {
    double: (state) => state.n * 2,
  },

  state: () => ({
    decrementedTimes: 0,
    incrementedTimes: 0,
    n: 2,
    numbers: [] as number[],
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
}
