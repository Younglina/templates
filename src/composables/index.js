export * from './dark'
export * from './useMsg'
import Http from '../utils/http.js'
export const useHttp = Http
export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))