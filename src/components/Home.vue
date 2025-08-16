<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-200">
    <!-- Loading Spinner -->
    <div v-if="loading" class="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-300"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
      <div class="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded">
        {{ error }}
        <button @click="fetchData" class="ml-4 underline">Retry</button>
      </div>
    </div>

    <!-- NAV -->
    <header class="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <router-link to="/" class="font-semibold tracking-wide text-neutral-300 hover:text-white">Jon AI Lab</router-link>
        <div class="ml-auto flex items-center gap-3">
          <div class="relative hidden sm:block">
            <input v-model="q" type="search" placeholder="Search Blog" class="w-64 rounded-lg bg-neutral-900 border border-neutral-800 pl-9 pr-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700" />
            <svg class="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-3.5-3.5"/></svg>
          </div>
        </div>
      </div>
    </header>

    <!-- PAGE TITLE -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 text-left">
      <h1 class="text-5xl font-extrabold tracking-tight text-neutral-300">Blog</h1>
    </section>

    <!-- FEATURED -->
    <section v-if="featuredArticle" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 cursor-pointer group" @click="viewArticle(featuredArticle)">
      <div class="aspect-[16/11] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        <img 
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          :src="featuredArticle.thumbnail_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop'" 
          alt="cover"
        />
      </div>
      <div class="flex flex-col justify-center gap-3">
        <div class="flex items-center gap-2 text-xs">
          <span class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
            {{ getCategoryName(featuredArticle.category_id) }}
          </span>
          <span class="text-neutral-500">{{ formatDate(featuredArticle.created_at) }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold leading-tight group-hover:text-white transition-colors">{{ featuredArticle.title }}</h2>
        <p class="text-sm text-neutral-400 leading-relaxed line-clamp-4">{{ featuredArticle.excerpt }}</p>
        <div class="flex items-center gap-2 text-xs text-neutral-500">
          <div class="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">👤</div>
          <span>Author</span>
          <span>·</span>
          <span>{{ featuredArticle.view_count }} views</span>
        </div>
        <button class="mt-2 inline-flex items-center gap-1 text-sm text-neutral-300 hover:underline">
          Read Article
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>

    <!-- GRID -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="post in filteredPosts" :key="post.id" class="group cursor-pointer" @click="viewArticle(post)">
          <div class="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <img 
              :src="post.thumbnail_url || `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop`" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="mt-3 flex items-center gap-2 text-[11px] text-neutral-400">
            <span class="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
              {{ getCategoryName(post.category_id) }}
            </span>
            <span class="ml-auto">{{ post.view_count }} views</span>
          </div>
          <h3 class="mt-2 text-lg font-semibold">{{ post.title }}</h3>
          <p class="mt-1 text-sm text-neutral-400 line-clamp-3">{{ post.excerpt }}</p>
          <div class="mt-3 flex items-center gap-2 text-xs text-neutral-500">
            <div class="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center">👤</div>
            <span>Author</span>
            <span>·</span>
            <span>{{ formatDate(post.created_at) }}</span>
          </div>
          <button class="mt-2 inline-flex items-center gap-1 text-sm text-neutral-300 hover:underline">
            View details
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </article>
      </div>

      <!-- PAGINATION -->
      <div v-if="totalPages > 1" class="mt-10 flex items-center justify-between">
        <button 
          class="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 disabled:opacity-50" 
          :disabled="currentPage === 1" 
          @click="goToPage(currentPage - 1)"
        >
          Previous
        </button>
        <div class="flex items-center gap-2">
          <button 
            v-for="p in displayPages" 
            :key="p" 
            @click="goToPage(p)" 
            class="w-8 h-8 grid place-items-center rounded-lg border border-neutral-800 hover:border-neutral-700" 
            :class="p === currentPage ? 'bg-white/10' : 'bg-neutral-900'"
          >
            {{ p }}
          </button>
        </div>
        <button 
          class="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 disabled:opacity-50" 
          :disabled="currentPage === totalPages" 
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </section>

    <!-- SUBSCRIBE -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
        <h3 class="text-2xl font-semibold">See our blog</h3>
        <p class="mt-1 text-sm text-neutral-400">Stay current with the latest design trends, software, industry expectations and more.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 py-10 text-sm text-neutral-400">
      <div class="flex justify-between flex-wrap gap-4">
        <div>
          <p class="uppercase text-[11px] tracking-wider">Find us on</p>
          <div class="mt-2 flex items-center gap-3">
            <a href="#" aria-label="x">✖️</a>
            <a href="#" aria-label="ig">📷</a>
            <a href="#" aria-label="yt">▶️</a>
            <a href="#" aria-label="gh">🐙</a>
          </div>
        </div>
        <div class="text-right">
          <p>© 2024 Drippy, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { articles, categories } from '../services/api.js'

const router = useRouter()

// Reactive data
const q = ref('')
const currentPage = ref(1)
const selectedCategory = ref<number | null>(null)
const loading = ref(false)
const error = ref('')

// API data
const allArticles = ref([])
const allCategories = ref([])
const totalCount = ref(0)
const pageSize = 10

// Computed properties
const featuredArticle = computed(() => {
  return allArticles.value.find((article: any) => article.status === 'published') || allArticles.value[0]
})

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize))

const displayPages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const filteredPosts = computed(() => {
  let filtered = allArticles.value.filter((article: any) => {
    // Filter by category if selected
    if (selectedCategory.value && article.category_id !== selectedCategory.value) {
      return false
    }
    
    // Filter by search query
    if (q.value.trim()) {
      const query = q.value.trim().toLowerCase()
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  // Remove featured article from the list
  if (featuredArticle.value) {
    filtered = filtered.filter((article: any) => article.id !== featuredArticle.value.id)
  }

  return filtered
})

// Helper functions
const getCategoryName = (categoryId: number) => {
  const category = allCategories.value.find((cat: any) => cat.id === categoryId)
  return category ? category.name : 'Uncategorized'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return '1 day ago'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  
  return date.toLocaleDateString()
}

const viewArticle = async (article: any) => {
  // Navigate to article detail page
  router.push(`/article/${article.id}`)
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await fetchArticles()
  }
}

// API functions
const fetchCategories = async () => {
  try {
    const response = await categories.getAll()
    if (response.success) {
      allCategories.value = response.data.categories
    }
  } catch (err: any) {
    console.error('Failed to fetch categories:', err)
    error.value = err.message || 'Failed to fetch categories'
  }
}

const fetchArticles = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const params = {
      page: currentPage.value,
      limit: pageSize,
      status: 'published',
      orderBy: 'created_at',
      orderDir: 'DESC'
    }
    
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value
    }
    
    const response = await articles.getAll(params)
    
    if (response.success) {
      allArticles.value = response.data.articles
      totalCount.value = response.data.total
    }
  } catch (err: any) {
    console.error('Failed to fetch articles:', err)
    error.value = err.message || 'Failed to fetch articles'
    // Fallback to empty data
    allArticles.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

const fetchData = async () => {
  await Promise.all([
    fetchCategories(),
    fetchArticles()
  ])
}

// Watchers
watch([selectedCategory, q], () => {
  currentPage.value = 1
  if (!q.value.trim()) {
    fetchArticles()
  }
})

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
:deep(.line-clamp-3) { 
  display: -webkit-box; 
  -webkit-line-clamp: 3; 
  line-clamp: 3; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
:deep(.line-clamp-4) { 
  display: -webkit-box; 
  -webkit-line-clamp: 4; 
  line-clamp: 4; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
</style>