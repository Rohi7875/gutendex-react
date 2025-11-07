import React, { useState } from 'react'

const normalizeUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return url.replace('http://', 'https://')
  if (url.startsWith('//')) return `https:${url}`
  return url
}

const buildLinkEntries = (book) => {
  if (Array.isArray(book.links)) {
    return book.links
      .filter(link => link?.url)
      .map(link => ({ mime: link.mime_type?.toLowerCase() || '', url: normalizeUrl(link.url) }))
  }

  if (book.formats && typeof book.formats === 'object') {
    return Object.entries(book.formats)
      .filter(([mime, url]) => mime && url)
      .map(([mime, url]) => ({ mime: mime.toLowerCase(), url: normalizeUrl(url) }))
  }

  return []
}

const findViewableUrl = (entries) => {
  const filtered = entries.filter(entry => entry.url && !entry.mime.includes('zip') && !entry.url.toLowerCase().endsWith('.zip'))
  const find = (predicate) => filtered.find(entry => predicate(entry.mime))

  const html = find(mime => mime.startsWith('text/html') || mime.includes('text/html'))
  if (html) return html.url

  const pdf = find(mime => mime.includes('application/pdf') || mime.includes('pdf'))
  if (pdf) return pdf.url

  const txt = find(mime => mime.startsWith('text/plain') || mime.includes('text/plain'))
  if (txt) return txt.url

  return null
}

const findCoverUrl = (entries) => {
  const cover = entries.find(entry => entry.mime.startsWith('image/'))
  return cover ? cover.url : ''
}

export default function BookCard({ book }) {
  const [showImage, setShowImage] = useState(true)
  const entries = buildLinkEntries(book)
  const cover = findCoverUrl(entries)

  function handleOpen() {
    // Try to open book in viewable format (HTML > PDF > TXT priority)
    const targetUrl = findViewableUrl(entries)
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    } else {
      // REQUIREMENT: Exact error message
      alert('No viewable version available')
    }
  }

  const fallback = book.title?.[0] || '?'

  return (
    <article onClick={handleOpen} className="book-card bg-white p-3 flex gap-4 cursor-pointer">
      {cover && showImage ? (
        <img
          src={cover}
          alt={book.title}
          className="cover"
          onError={() => setShowImage(false)}
        />
      ) : (
        <div className="cover flex items-center justify-center bg-graysoft text-primary text-3xl">
          {fallback}
        </div>
      )}
      <div className="flex-1">
        <div className="small12 font-semibold">{book.title}</div>
        <div className="small12 text-midgray">{(book.authors || []).map(a => a.name).join(', ')}</div>
        <div className="mt-2 small12 text-midgray">{(book.subjects || []).slice(0, 3).join(', ')}</div>
      </div>
    </article>
  )
}

