import { useTranslation } from 'react-i18next'
import type { Course } from '../types'
import { courseCategoryLabels, difficultyLabels } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import MediaCard from './MediaCard'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation()
  const { toggleFavorite, isFavorite } = useFavorites()
  const catLabel = courseCategoryLabels[course.category]
  const diffLabel = difficultyLabels[course.level]
  const liked = isFavorite(course.id)

  return (
    <MediaCard
      linkTo={`/courses/${course.id}`}
      thumbnail={course.thumbnail}
      title={course.title}
      categoryLabel={catLabel}
      difficultyLabel={diffLabel}
      isFavorited={liked}
      onFavorite={() => toggleFavorite({ id: course.id, type: 'course', title: course.title, thumbnail: course.thumbnail })}
    >
      <p className="text-sm text-zinc-400 line-clamp-2">{course.description}</p>
      <div className="text-xs text-zinc-500">{t('courses.actionsCount', { count: course.actions.length })}</div>
    </MediaCard>
  )
}
