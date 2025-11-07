import React from 'react'
import FictionIcon from '../assets/Fiction.svg'
import DramaIcon from '../assets/Drama.svg'
import HumourIcon from '../assets/Humour.svg'
import PoliticsIcon from '../assets/Politics.svg'
import PhilosophyIcon from '../assets/Philosophy.svg'
import HistoryIcon from '../assets/History.svg'
import AdventureIcon from '../assets/Adventure.svg'
import ChildrenIcon from '../assets/Children.svg'
import PoetryIcon from '../assets/Poetry.svg'
import RomanceIcon from '../assets/Romance.svg'

const ICONS = {
  FICTION: FictionIcon,
  DRAMA: DramaIcon,
  HUMOUR: HumourIcon,
  POLITICS: PoliticsIcon,
  PHILOSOPHY: PhilosophyIcon,
  HISTORY: HistoryIcon,
  ADVENTURE: AdventureIcon,
  CHILDREN: ChildrenIcon,
  POETRY: PoetryIcon,
  ROMANCE: RomanceIcon
}

export default function GenreCard({ title, onClick }) {
  const Icon = ICONS[title.toUpperCase()]
  return (
    <button
      onClick={onClick}
      className="genre-card bg-white p-3 h-12 flex items-center gap-3 hover:shadow-md transition"
    >
      {Icon && <img src={Icon} alt={`${title} icon`} className="w-6 h-6" />}
      <div className="genre-text font-normal text-dark">{title}</div>
    </button>
  )
}

