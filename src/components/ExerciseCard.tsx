import type { Exercise } from '../types'
import { exerciseCategoryLabels, difficultyLabels } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import MediaCard from './MediaCard'

interface ExerciseCardProps {
  exercise: Exercise
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const catLabel = exerciseCategoryLabels[exercise.category]
  const diffLabel = difficultyLabels[exercise.difficulty]
  const liked = isFavorite(exercise.id)

  return (
    <MediaCard
      linkTo={`/exercises/${exercise.id}`}
      thumbnail={exercise.thumbnail}
      title={exercise.name}
      aspectRatio="aspect-[4/3]"
      categoryLabel={catLabel}
      difficultyLabel={diffLabel}
      isFavorited={liked}
      onFavorite={() => toggleFavorite({ id: exercise.id, type: 'exercise', title: exercise.name, thumbnail: exercise.thumbnail })}
    >
      <p className="text-xs text-zinc-500 line-clamp-2">{exercise.instruction.slice(0, 60)}...</p>
    </MediaCard>
  )
}
