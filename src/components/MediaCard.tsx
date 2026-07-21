import { Link } from 'react-router-dom'
import { difficultyColors } from '../types'

interface MediaCardProps {
  linkTo: string
  thumbnail: string
  title: string
  aspectRatio?: string
  categoryLabel: string
  difficultyLabel: string
  children?: React.ReactNode
  onFavorite: () => void
  isFavorited: boolean
}

const diffColor = difficultyColors

export default function MediaCard({
  linkTo,
  thumbnail,
  title,
  aspectRatio = 'aspect-video',
  categoryLabel,
  difficultyLabel,
  children,
  onFavorite,
  isFavorited,
}: MediaCardProps) {
  return (
    <div className="group relative rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-green-500/40 transition-colors">
      <Link to={linkTo} className="block">
        <div className={`${aspectRatio} w-full bg-zinc-800 overflow-hidden`}>
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
              {categoryLabel}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor[difficultyLabel] || 'bg-zinc-800 text-zinc-300'}`}>
              {difficultyLabel}
            </span>
          </div>
          <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          {children}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); onFavorite() }}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <span className={`text-lg ${isFavorited ? 'text-red-500' : 'text-white/70'}`}>♥</span>
      </button>
    </div>
  )
}
