import { useTranslation, Trans } from 'react-i18next'
import { X, Film } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoUrl?: string
  thumbnail?: string
  type?: 'course' | 'exercise'
}

type EmbedType = 'youtube' | 'bilibili' | 'direct' | 'none'

function getEmbedInfo(url?: string): { type: EmbedType; src: string } {
  if (!url) return { type: 'none', src: '' }

  // YouTube: https://www.youtube.com/watch?v=XXX  or  https://youtu.be/XXX
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1` }

  // Bilibili: https://www.bilibili.com/video/BVXXX
  const bvMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/)
  if (bvMatch) return { type: 'bilibili', src: `https://player.bilibili.com/player.html?bvid=${bvMatch[1]}&autoplay=0` }

  // mp4/webm direct link
  if (url.match(/\.(mp4|webm)(\?|$)/i) || url.startsWith('blob:')) {
    return { type: 'direct', src: url }
  }

  // Fallback: treat as direct video
  return { type: 'direct', src: url }
}

export default function VideoModal({ isOpen, onClose, title, videoUrl, thumbnail, type = 'course' }: VideoModalProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const { type: embedType, src } = getEmbedInfo(videoUrl)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h3 className="font-semibold text-white truncate mr-4">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative aspect-video bg-black">
          {embedType === 'youtube' && (
            <iframe
              src={src}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          )}

          {embedType === 'bilibili' && (
            <iframe
              src={src}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={title}
            />
          )}

          {embedType === 'direct' && (
            <video
              src={src}
              controls
              autoPlay
              className="w-full h-full"
            >
              {t('video.notSupported')}
            </video>
          )}

          {embedType === 'none' && (
            <div className="w-full h-full flex items-center justify-center">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover opacity-15"
                />
              )}
              <div className="relative z-10 text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                  <Film className="h-10 w-10 text-zinc-500" />
                </div>
                <p className="text-zinc-300 text-lg font-medium mb-2">{t('video.noVideo')}</p>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                  <Trans i18nKey="video.noVideoHint" />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 border-t border-zinc-800">
          <p className="text-sm text-zinc-400">
            {type === 'course' ? t('video.courseVideo') : t('video.exerciseDemo')}
          </p>
        </div>
      </div>
    </div>
  )
}
