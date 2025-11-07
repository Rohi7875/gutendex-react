import React from 'react'

export default function BookCard({ book }) {
  function openPref(b) {
    const formats = b.formats || {}
    const entries = Object.entries(formats).filter(([m, u]) => u && !m.includes('zip') && !m.startsWith('image/'))
    const find = (pred) => entries.find(([m]) => pred(m.toLowerCase()))
    const html = find(m => m.startsWith('text/html') || m.includes('text/html'))
    const pdf = find(m => m.includes('pdf') || m.startsWith('application/pdf'))
    const txt = find(m => m.startsWith('text/plain') || m.includes('text/plain'))
    const chosen = html || pdf || txt
    if (chosen) window.open(chosen[1], '_blank', 'noopener,noreferrer')
    else alert('No viewable version available')
  }

  const cover = book.formats?.['image/jpeg'] || book.formats?.['image/png'] || ''

  return (
    <article onClick={() => openPref(book)} className="book-card bg-white p-3 flex gap-4 cursor-pointer">
      <img src={cover} alt={book.title} className="cover" />
      <div className="flex-1">
        <div className="small12 font-semibold">{book.title}</div>
        <div className="small12 text-midgray">{(book.authors || []).map(a => a.name).join(', ')}</div>
        <div className="mt-2 small12 text-midgray">{(book.subjects || []).slice(0, 3).join(', ')}</div>
      </div>
    </article>
  )
}

