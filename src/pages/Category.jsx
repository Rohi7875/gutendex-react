import React, { useEffect, useRef, useState, useCallback } from 'react'
import BookCard from '../components/BookCard'
import BackIcon from '../assets/Back.svg'
import SearchIcon from '../assets/Search.svg'
import CancelIcon from '../assets/Cancel.svg'

// Use proxy API in production (HTTPS), direct API in development (HTTP)
const BASE = typeof window !== 'undefined' && window.location.protocol === 'https:'
  ? '/api/books'
  : 'http://13.126.242.247/api/v1/books'

const PER_PAGE = 25

// Build request URL with supplied filters
// Backend expects: topic, title, author, mime_type, page as separate query parameters
// Multiple values per filter are comma-separated
const buildUrl = ({ category, page, titleQuery, authorQuery }) => {
  const params = new URLSearchParams()

  if (category && category.trim()) {
    params.set('topic', category.trim())
  }

  if (titleQuery && titleQuery.trim()) {
    params.set('title', titleQuery.trim())
  }

  if (authorQuery && authorQuery.trim()) {
    params.set('author', authorQuery.trim())
  }

  // Requirement: Only return books with cover images
  params.set('mime_type', 'image/jpeg,image/png,image/jpg')

  if (page && page > 0) {
    params.set('page', page.toString())
  }

  const url = `${BASE}?${params.toString()}`
  console.log('API Request:', url)
  return url
}

// Extract books from API response (supports both new and legacy shapes)
const extractBooks = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload.books)) return payload.books
  if (Array.isArray(payload.results)) return payload.results
  return []
}

// Extract total count from response
const extractTotalCount = (payload) => {
  if (!payload) return 0
  if (typeof payload.total_count === 'number') return payload.total_count
  if (typeof payload.count === 'number') return payload.count
  return 0
}

// Generate a stable unique key for each book (avoids duplicate React keys)
const getBookKey = (book) => {
  const id = book.gutenberg_id || book.id || ''
  const title = (book.title || '').trim().toLowerCase()
  const authors = Array.isArray(book.authors)
    ? book.authors.map(a => (a?.name || '').trim().toLowerCase()).join('|')
    : ''
  const firstLink = Array.isArray(book.links) && book.links.length > 0 ? (book.links[0].url || '') : ''
  return `${id}::${title}::${authors}::${firstLink}`
}

export default function Category({ category, onBack }) {
  const [books, setBooks] = useState([])
  const [totalCount, setTotalCount] = useState(null)
  const [loadedCount, setLoadedCount] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [error, setError] = useState(null)
  const sentinel = useRef(null)

  const fetchPage = useCallback(async ({ pageToLoad, titleQuery, authorQuery }) => {
    const url = buildUrl({ category, page: pageToLoad, titleQuery, authorQuery })
    const res = await fetch(url)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const payload = await res.json()
    return {
      books: extractBooks(payload),
      total: extractTotalCount(payload),
    }
  }, [category])

  const fetchBooks = useCallback(async ({ pageToLoad, reset = false }) => {
    setLoading(true)
    try {
      const searchTerm = debounced.trim()
      let responses = []

      if (searchTerm) {
        const [titleResult, authorResult] = await Promise.all([
          fetchPage({ pageToLoad, titleQuery: searchTerm, authorQuery: '' }),
          fetchPage({ pageToLoad, titleQuery: '', authorQuery: searchTerm }),
        ])
        responses = [titleResult, authorResult]
      } else {
        const result = await fetchPage({ pageToLoad, titleQuery: '', authorQuery: '' })
        responses = [result]
      }

      const combinedMap = new Map()
      let maxTotal = 0
      let anyBooksReturned = false

      responses.forEach(({ books: batchBooks, total }) => {
        if (Array.isArray(batchBooks) && batchBooks.length > 0) {
          anyBooksReturned = true
          batchBooks.forEach(book => {
            combinedMap.set(getBookKey(book), book)
          })
        }
        maxTotal = Math.max(maxTotal, total || 0)
      })

      if (!anyBooksReturned) {
        if (reset) {
          setBooks([])
          setLoadedCount(0)
          setTotalCount(maxTotal)
        }
        setHasMore(false)
        setError(null)
        setLoading(false)
        return
      }

      const combinedBooks = Array.from(combinedMap.values())

      if (reset) {
        setBooks(combinedBooks)
        setLoadedCount(combinedBooks.length)
      } else {
        setBooks(prev => {
          const mergedMap = new Map()
          prev.forEach(book => mergedMap.set(getBookKey(book), book))
          combinedBooks.forEach(book => mergedMap.set(getBookKey(book), book))
          const merged = Array.from(mergedMap.values())
          setLoadedCount(merged.length)
          return merged
        })
      }

      setTotalCount(maxTotal || combinedBooks.length)
      const moreTitle = responses[0]?.total > pageToLoad * PER_PAGE
      const moreAuthor = responses[1]?.total > pageToLoad * PER_PAGE
      const shouldLoadMore = searchTerm ? (moreTitle || moreAuthor) : moreTitle
      setHasMore(shouldLoadMore)
      setError(null)
      setPage(pageToLoad + 1)
    } catch (e) {
      console.error('Failed to load books:', e)
      setError('Failed to load books. Please try again.')
      if (reset) {
        setBooks([])
        setLoadedCount(0)
        setTotalCount(0)
      }
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [debounced, fetchPage])

  useEffect(() => {
    setBooks([])
    setTotalCount(null)
    setLoadedCount(0)
    setPage(1)
    setHasMore(true)
    setError(null)
    if (category) {
      fetchBooks({ pageToLoad: 1, reset: true })
    }
  }, [category, debounced, fetchBooks])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 450)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!sentinel.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !loading) {
          fetchBooks({ pageToLoad: page, reset: false })
        }
      })
    })
    obs.observe(sentinel.current)
    return () => obs.disconnect()
  }, [hasMore, loading, page, fetchBooks])

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="px-3 py-1 bg-white rounded flex items-center gap-2" onClick={onBack}>
          <img src={BackIcon} alt="Back" className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h3 className="h2">{category}</h3>
        <div className="ml-auto text-sm text-midgray">
          {totalCount !== null ? `${totalCount} book${totalCount !== 1 ? 's' : ''}` : ''}
          {totalCount !== null && loadedCount < totalCount && (
            <span className="ml-2 text-xs">Loaded {loadedCount}</span>
          )}
        </div>
      </div>

      <div className="relative mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search title or author within ${category}...`}
          className="w-full p-2 pl-10 pr-10 rounded h-10"
        />
        <img src={SearchIcon} alt="Search" className="absolute left-3 top-2.5 w-5 h-5 opacity-80" />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-2.5">
            <img src={CancelIcon} alt="Clear" className="w-5 h-5 opacity-80" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {books.map(book => (
          <BookCard key={getBookKey(book)} book={book} />
        ))}
      </div>

      <div ref={sentinel} style={{ height: 1 }} />

      {loading && <div className="mt-4 text-center text-midgray">Loading...</div>}
      {!loading && books.length === 0 && !error && <div className="mt-4 text-center text-midgray">No books found</div>}
    </div>
  )
}

