import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import ArticleDetail from '../components/ArticleDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Jon AI Lab - Blog'
    }
  },
  {
    path: '/article/:id',
    name: 'ArticleById',
    component: ArticleDetail,
    meta: {
      title: 'Article - Jon AI Lab'
    }
  },
  {
    path: '/article/slug/:slug',
    name: 'ArticleBySlug',
    component: ArticleDetail,
    meta: {
      title: 'Article - Jon AI Lab'
    }
  },
  {
    // Catch-all route for 404
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Jon AI Lab'
  next()
})

export default router