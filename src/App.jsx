import React, { useState } from 'react'
import Home from './pages/Home'
import Category from './pages/Category'
import Pattern from './assets/Pattern.svg' // optional background, add to src/assets/

export default function App() {
  const [page, setPage] = useState('home')
  const [selected, setSelected] = useState('')

  return (
    <div
      className="min-h-screen bg-page text-dark"
      style={{
        backgroundImage: `url(${Pattern})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right top',
        backgroundSize: '240px'
      }}
    >
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="h1">Gutenberg Project</h1>
          <p className="body-text text-midgray">A social cataloging website that allows you to freely search its database of books, annotations, and reviews.</p>
        </header>
        {page === 'home' ? (
          <Home onSelect={(c) => { setSelected(c); setPage('category') }} />
        ) : (
          <Category category={selected} onBack={() => setPage('home')} />
        )}
      </div>
    </div>
  )
}
