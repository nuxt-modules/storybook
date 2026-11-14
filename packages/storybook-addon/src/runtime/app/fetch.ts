import { $fetch } from 'ofetch'

globalThis.$fetch ??= $fetch.create({
  baseURL: '/',
}) as typeof globalThis.$fetch
