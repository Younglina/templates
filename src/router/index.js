/*
 * @Author: younglina younglina0409@gmail.com
 * @Date: 2024-01-07 09:35:02
 * @Description: 路由
 */
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
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/person',
    name: 'person',
    children: [],
    meta: {
      title: '个人中心',
      icon: person,
      notRoute: true,
    },
  },
  {
    path: '/api',
    name: 'buttApi',
    component: () => import('@/views/web/buttApi/index.vue'),
    meta: {
      icon: plug,
      title: 'API对接',
    },
    children: [
      {
        path: '',
        name: 'api',
        component: () => import('@/views/web/buttApi/api.vue'),
        meta: {
          title: 'API对接',
        },
      },
      {
        path: '/drawmj',
        name: 'drawmj',
        component: () => import('@/views/web/buttApi/drawmj.vue'),
        meta: {
          title: 'MidJourney',
        },
      },
      {
        path: '/drawdalle',
        name: 'drawdalle',
        component: () => import('@/views/web/buttApi/drawdalle.vue'),
        meta: {
          title: '普通绘画',
        },
      },
      {
        path: '/mypic',
        name: 'mypic',
        component: () => import('@/views/web/buttApi/mypic.vue'),
        meta: {
          title: '我的作品',
        },
      },
      {
        path: '/mjshowcase',
        name: 'mjshowcase',
        component: () => import('@/views/web/buttApi/mypic.vue'),
        meta: {
          title: '绘画广场',
        },
      }
    ],
  },
  {
    path: '/outDrawdalle',
    name: 'outDrawdalle',
    children: [],
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
    path: '/customService',
    name: 'customService',
    children: [],
    meta: {
      title: '联系客服',
      icon: mic,
      notRoute: true,
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
