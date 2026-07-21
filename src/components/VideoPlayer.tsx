import { useTranslation } from 'react-i18next'

interface VideoPlayerProps {
  poster?: string
  title: string
  onPlay?: () => void
}

export default function VideoPlayer({ poster, title, onPlay }: VideoPlayerProps) {
  const { t } = useTranslation()
  return (
    <div
      className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group cursor-pointer"
      onClick={onPlay}
    >
      {/* Poster / placeholder */}
      {poster ? (
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">{t('exercises.videoPreview', { title })}</p>
            <p className="text-zinc-600 text-xs mt-1">{t('exercises.videoPlaceholder')}</p>
          </div>
        </div>
      )}

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-green-500/90 flex items-center justify-center shadow-lg group-hover:bg-green-400 group-hover:scale-110 transition-all">
          <svg className="h-7 w-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Hover hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
        {t('video.clickToPlay')}
      </div>
    </div>
  )
}
