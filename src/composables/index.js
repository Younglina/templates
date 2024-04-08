export * from './dark'
import Http from '../utils/http.js'
export const useHttp = Http
export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))