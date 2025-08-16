<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-200">
    <!-- Loading Spinner -->
    <div v-if="loading" class="fixed inset-0 bg-neutral-950/80 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-300"></div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
      <div class="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded">
        {{ error }}
        <button @click="fetchArticle" class="ml-4 underline">Retry</button>
      </div>
    </div>

    <!-- Navigation -->
    <header class="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-6">
        <router-link to="/" class="font-semibold tracking-wide text-neutral-300 hover:text-white">
          Jon AI Lab
        </router-link>
        <div class="ml-auto flex items-center gap-3">
          <router-link 
            to="/" 
            class="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-sm"
          >
            ← Back to Blog
          </router-link>
        </div>
      </div>
    </header>

    <!-- Article Content -->
    <article v-if="article && !loading" class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-10">
      <!-- Article Header -->
      <header class="mb-8">
        <div class="flex items-center gap-2 text-xs text-neutral-400 mb-4">
          <span class="px-2 py-1 rounded bg-neutral-900 border border-neutral-800">
            {{ getCategoryName(article.category_id) }}
          </span>
          <span>{{ formatDate(article.created_at) }}</span>
          <span>•</span>
          <span>{{ article.view_count }} views</span>
          <span>•</span>
          <span>{{ article.like_count }} likes</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-100 mb-6 leading-tight">
          {{ article.title }}
        </h1>
        
        <p v-if="article.excerpt" class="text-xl text-neutral-400 leading-relaxed mb-6">
          {{ article.excerpt }}
        </p>

        <!-- Featured Image -->
        <div v-if="article.thumbnail_url" class="aspect-[16/9] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 mb-8">
          <img 
            :src="article.thumbnail_url" 
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Article Meta -->
        <div class="flex items-center justify-between py-4 border-y border-neutral-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
              👤
            </div>
            <div>
              <p class="text-sm font-medium text-neutral-200">Author</p>
              <p class="text-xs text-neutral-400">Published {{ formatDate(article.published_at || article.created_at) }}</p>
            </div>
          </div>
          
          <!-- Interaction Buttons -->
          <div class="flex items-center gap-3">
            <button 
              @click="toggleLike"
              :disabled="likingInProgress"
              :class="hasLiked ? 'text-red-400 bg-red-900/20' : 'text-neutral-400 bg-neutral-900'"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {{ article.like_count }}
            </button>
            
            <button 
              @click="shareArticle"
              class="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 text-neutral-400 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              Share
            </button>
          </div>
        </div>
      </header>

      <!-- Article Body -->
      <div class="prose prose-lg prose-invert max-w-none" style="font-size: 30px;text-align: left;">
        <div v-html="article.content" class="text-neutral-300 leading-relaxed"></div>
      </div>

      <!-- Article Footer -->
      <footer class="mt-12 pt-8 border-t border-neutral-800">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-2 text-sm text-neutral-400">
            <span>Last updated: {{ formatDate(article.updated_at) }}</span>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="toggleLike"
              :disabled="likingInProgress"
              :class="hasLiked ? 'text-red-400 border-red-800' : 'text-neutral-400 border-neutral-800'"
              class="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-neutral-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {{ hasLiked ? 'Liked' : 'Like this article' }}
            </button>
          </div>
        </div>
      </footer>
    </article>

    <!-- Related Articles Section -->
    <section v-if="relatedArticles.length > 0" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <h2 class="text-3xl font-bold text-neutral-200 mb-8">Related Articles</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article 
          v-for="relatedArticle in relatedArticles" 
          :key="relatedArticle.id" 
          class="group cursor-pointer"
          @click="navigateToArticle(relatedArticle)"
        >
          <div class="aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <img 
              :src="relatedArticle.thumbnail_url || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop'" 
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div class="mt-3">
            <div class="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span class="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                {{ getCategoryName(relatedArticle.category_id) }}
              </span>
            </div>
            <h3 class="text-lg font-semibold text-neutral-200 group-hover:text-white transition-colors">
              {{ relatedArticle.title }}
            </h3>
            <p class="text-sm text-neutral-400 mt-1 line-clamp-2">{{ relatedArticle.excerpt }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
      <div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 md:p-8">
        <h3 class="text-2xl font-semibold">Stay Updated</h3>
        <p class="mt-1 text-sm text-neutral-400">Get notified when new articles are published.</p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <div class="relative grow">
            <input 
              type="email" 
              placeholder="Email Address" 
              class="w-full rounded-lg bg-neutral-950 border border-neutral-800 pl-9 pr-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            />
            <svg class="w-4 h-4 absolute left-2.5 top-2.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/>
            </svg>
          </div>
          <button class="rounded-lg px-4 py-2 text-sm bg-white/10 hover:bg-white/15 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
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
          <p>© 2024 Jon AI Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles, categories, analytics } from '../services/api.js'

const route = useRoute()
const router = useRouter()

// Reactive data
const article = ref(null)
const allCategories = ref([])
const relatedArticles = ref([])
const loading = ref(false)
const error = ref('')
const hasLiked = ref(false)
const likingInProgress = ref(false)

// Get article ID from route params
const articleId = computed(() => route.params.id || route.params.slug)
debugger

// Helper functions
const getCategoryName = (categoryId: number) => {
  const category = allCategories.value.find((cat: any) => cat.id === categoryId)
  return category ? category.name : 'Uncategorized'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const navigateToArticle = (relatedArticle: any) => {
  router.push(`/article/${relatedArticle.id}`)
}

const shareArticle = async () => {
  if (navigator.share && article.value) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.excerpt,
        url: window.location.href,
      })
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('Article URL copied to clipboard!')
    }
  } else {
    // Fallback for browsers without Web Share API
    navigator.clipboard.writeText(window.location.href)
    alert('Article URL copied to clipboard!')
  }
}

const toggleLike = async () => {
  if (!article.value || likingInProgress.value) return
  
  try {
    likingInProgress.value = true
    const response = await analytics.toggleLike(article.value.id)
    
    if (response.success) {
      hasLiked.value = response.data.liked
      article.value.like_count = response.data.like_count
    }
  } catch (err) {
    console.error('Failed to toggle like:', err)
  } finally {
    likingInProgress.value = false
  }
}

// API functions
const fetchCategories = async () => {
  try {
    const response = await categories.getAll()
    if (response.success) {
      allCategories.value = response.data.categories
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const fetchArticle = async () => {
  if (!articleId.value) return
  
  try {
    loading.value = true
    error.value = ''
    
    // Fetch article by ID or slug
    let response
    if (isNaN(Number(articleId.value))) {
      // It's a slug
      response = await articles.getBySlug(articleId.value)
    } else {
      // It's an ID
      response = await articles.getById(Number(articleId.value))
    }
    
    if (response.success) {
      article.value = response.data.article
      
      // Increment view count
      await analytics.incrementView(article.value.id)
      article.value.view_count++
      
      // Check like status
      const likeStatus = await analytics.getLikeStatus(article.value.id)
      if (likeStatus.success) {
        hasLiked.value = likeStatus.data.has_liked
      }
      
      // Fetch related articles
      await fetchRelatedArticles()
    }
  } catch (err: any) {
    console.error('Failed to fetch article:', err)
    error.value = err.message || 'Failed to fetch article'
  } finally {
    loading.value = false
  }
}

const fetchRelatedArticles = async () => {
  if (!article.value) return
  
  try {
    const response = await articles.getAll({
      category_id: article.value.category_id,
      status: 'published',
      limit: 3,
      orderBy: 'created_at',
      orderDir: 'DESC'
    })
    
    if (response.success) {
      // Filter out current article
      relatedArticles.value = response.data.articles.filter(
        (a: any) => a.id !== article.value.id
      ).slice(0, 3)
    }
  } catch (err) {
    console.error('Failed to fetch related articles:', err)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchArticle()
  ])
})

// Watch for route changes
watch(() => route.params.id || route.params.slug, () => {
  fetchArticle()
})
</script>

<style scoped>
.prose {
  color: rgb(212 212 212);
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: rgb(245 245 245);
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h1 { font-size: 2.25rem; }
.prose h2 { font-size: 1.875rem; }
.prose h3 { font-size: 1.5rem; }

.prose p {
  margin-bottom: 1.25rem;
  line-height: 1.75;
}

.prose a {
  color: rgb(96 165 250);
  text-decoration: underline;
}

.prose a:hover {
  color: rgb(147 197 253);
}

.prose ul, .prose ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid rgb(75 85 99);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: rgb(156 163 175);
}

.prose code {
  background-color: rgb(55 65 81);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: rgb(31 41 55);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose img {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.line-clamp-2 { 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}
</style>