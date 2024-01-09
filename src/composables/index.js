/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 
 */
export * from './dark'
export * from './useMsg'
import Http from '../utils/http.js'
export const useHttp = Http
export const toByCode = (id = 8732) => { window.open(`${import.meta.env.VITE_BYCODEURL}?id=${id}`) }
export const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))