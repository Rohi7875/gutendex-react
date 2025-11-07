import React, { useEffect, useRef, useState, useCallback } from 'react'
import BookCard from '../components/BookCard'
import BackIcon from '../assets/Back.svg'
import SearchIcon from '../assets/Search.svg'
import CancelIcon from '../assets/Cancel.svg'

const BASE = 'http://skunkworks.ignitesol.com:8000'

// Fix next URLs that point to localhost
const normalizeUrl = (url) => {
  if (!url) return null
  // Replace any localhost URLs with the correct API server
  return url.replace(/http:\/\/localhost:\d+/, BASE)
}

export default function Category({ category, onBack }) {
  const [books, setBooks] = useState([])
  const [count, setCount] = useState(null)
  const [next, setNext] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [error, setError] = useState(null)
  const sentinel = useRef(null)

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()
    params.set('mime_type', 'image/')
    if (category) params.set('topic', category)
    if (debounced) params.set('search', debounced)
    return `${BASE}/books?${params.toString()}`
  }, [category, debounced])

  useEffect(() => {
    setBooks([]); setCount(null); setNext(null); setError(null)
    const url = buildUrl()
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const d = await res.json()
        if (cancelled) return
        setBooks(d.results || [])
        setCount(d.count ?? 0)
        setNext(normalizeUrl(d.next))
        setError(null)
      } catch (e) {
        console.error('Failed to load books:', e)
        setError('Failed to load books. Please try again.')
        if (!cancelled) setBooks([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => (cancelled = true)
  }, [buildUrl])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 450)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!sentinel.current) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && next && !loading) loadMore() })
    })
    obs.observe(sentinel.current)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, loading])

  async function loadMore() {
    if (!next || loading) return
    setLoading(true)
    try {
      const res = await fetch(next)
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const d = await res.json()
      setBooks(s => [...s, ...(d.results || [])])
      setNext(normalizeUrl(d.next))
      setError(null)
    } catch (e) {
      console.error('Failed to load more books:', e)
      setError('Failed to load more books.')
      // Clear next to stop infinite retry attempts
      setNext(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="px-3 py-1 bg-white rounded flex items-center gap-2" onClick={onBack}>
          <img src={BackIcon} alt="Back" className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h3 className="h2">{category}</h3>
        <div className="ml-auto text-sm text-midgray">{count === null ? '' : `${count} books`}</div>
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
        {books.map(b => <BookCard key={b.id} book={b} />)}
      </div>

      <div ref={sentinel} style={{ height: 1 }} />

      {loading && <div className="mt-4 text-center text-midgray">Loading...</div>}
      {!loading && books.length === 0 && !error && <div className="mt-4 text-center text-midgray">No books found</div>}
    </div>
  )
}

