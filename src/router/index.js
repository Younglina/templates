import { createRouter, createWebHashHistory } from 'vue-router'
import person from '@/assets/icon/person.svg'
import plug from '@/assets/icon/plug.svg'
import vip from '@/assets/icon/vip.svg'
import draw from '@/assets/icon/draw.svg'
import power from '@/assets/icon/power.svg'
import gift from '@/assets/icon/gift.svg'
import mic from '@/assets/icon/mic.svg'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/person',
    name: 'person',
    component: () => import('@/views/web/person.vue'),
    meta: {
      title: '个人中心',
      icon: person,
    },
  },
  {
    path: '/api',
    name: 'Api',
    component: () => import('@/views/web/api.vue'),
    meta: {
      title: 'api对接',
      icon: plug,
    },
  },
  {
    path: '/drawdalle',
    name: 'drawdalle',
    component: () => import('@/views/web/drawdalle.vue'),
    meta: {
      title: 'AI绘画',
      icon: draw,
    },
  },
  {
    path: '/joinVIP',
    name: 'joinVIP',
    component: () => import('@/views/web/joinVIP.vue'),
    meta: {
      title: '开通会员',
      icon: vip,
    },
  },
  {
    path: '/customeService',
    name: 'customeService',
    component: () => import('@/views/web/api.vue'),
    meta: {
      title: '联系客服',
      icon: mic,
    },
  },
  {
    path: '/api',
    name: 'Api',
    component: () => import('@/views/web/api.vue'),
    meta: {
      title: '邀请返现',
      icon: gift,
    },
  },
  {
    path: '/api',
    name: 'Api',
    component: () => import('@/views/web/api.vue'),
    meta: {
      title: '退出登陆',
      icon: power,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
