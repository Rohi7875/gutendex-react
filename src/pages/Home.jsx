import React from 'react'
import GenreCard from '../components/GenreCard'

const CATS = ['FICTION','DRAMA','HUMOUR','POLITICS','PHILOSOPHY','HISTORY','ADVENTURE','CHILDREN','POETRY','ROMANCE']

export default function Home({ onSelect }) {
  return (
    <div>
      <h2 className="h2 mb-4">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CATS.map(c => (
          <GenreCard key={c} title={c} onClick={() => onSelect(c)} />
        ))}
      </div>
    </div>
  )
}
