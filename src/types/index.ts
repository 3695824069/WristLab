import i18n from '../i18n'

// 课程分类
export type CourseCategory = 'fat_loss' | 'muscle_gain' | 'home' | 'arm_basic' | 'arm_strength' | 'arm_technique' | 'arm_rehab'

// 动作部位分类
export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'core' | 'grip' | 'forearm' | 'wrist' | 'bicep'

// 难度等级
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

// 计划类型
export type PlanType = '7day' | '21day' | '30day'

// 课程中的单个动作
export interface CourseAction {
  name: string
  reps: string
  instruction: string
  caution: string
}

// 课程
export interface Course {
  id: string
  title: string
  category: CourseCategory
  thumbnail: string
  videoUrl: string
  description: string
  duration: string
  level: Difficulty
  actions: CourseAction[]
}

// 动作
export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  thumbnail: string
  videoUrl: string
  instruction: string
  commonMistakes: string[]
  difficulty: Difficulty
}

// 计划中的单个训练项
export interface PlanExerciseItem {
  exerciseId?: string  // 引用 Exercise.id（可选 — 非动作项如"散步"无此字段）
  displayText: string  // 展示文本，保持与原始数据一致
}

// 计划中的一天
export interface PlanDay {
  day: number
  title: string
  exercises: PlanExerciseItem[]
  notes: string
}

// 训练计划
export interface Plan {
  id: string
  title: string
  type: PlanType
  description: string
  days: PlanDay[]
}

// 知识库分类
export type KnowledgeCategory = 'technique' | 'guide' | 'rehab'

// 知识库文章参考来源
export interface ArticleReference {
  title: string
  url?: string
  source: string // 来源机构（WAF, PubMed, Physiopedia 等）
}

// 知识库文章
export interface KnowledgeArticle {
  id: string
  title: string
  category: KnowledgeCategory
  summary: string
  content: string
  tags: string[]
  coverImage: string
  readTime: number
  relatedCourses?: string[]
  relatedArticles?: string[]
  references?: ArticleReference[]
  lastUpdated?: string
  disclaimer?: string // 自定义免责声明，为空则使用默认
}

// 分类标签映射（用于展示）
function createI18nRecord<T extends string>(keyMap: Record<T, string>): Record<T, string> {
  return new Proxy({} as Record<T, string>, {
    get: (_, prop: string | symbol) => {
      const key = keyMap[prop as T]
      return key ? i18n.t(key) : String(prop)
    },
  })
}

export const courseCategoryLabels: Record<CourseCategory, string> = createI18nRecord({
  fat_loss: 'courses.category_fat_loss',
  muscle_gain: 'courses.category_muscle_gain',
  home: 'courses.category_home',
  arm_basic: 'courses.category_arm_basic',
  arm_strength: 'courses.category_arm_strength',
  arm_technique: 'courses.category_arm_technique',
  arm_rehab: 'courses.category_arm_rehab',
})

export const exerciseCategoryLabels: Record<ExerciseCategory, string> = createI18nRecord({
  chest: 'exercises.category_chest',
  back: 'exercises.category_back',
  legs: 'exercises.category_legs',
  core: 'exercises.category_core',
  grip: 'exercises.category_grip',
  forearm: 'exercises.category_forearm',
  wrist: 'exercises.category_wrist',
  bicep: 'exercises.category_bicep',
})

export const difficultyLabels: Record<Difficulty, string> = createI18nRecord({
  beginner: 'courses.difficulty_beginner',
  intermediate: 'courses.difficulty_intermediate',
  advanced: 'courses.difficulty_advanced',
})

// 难度配色（统一配置）
export const difficultyColors: Record<string, string> = {
  '入门': 'bg-green-500/20 text-green-400 border-green-500/30',
  '进阶': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  '高级': 'bg-red-500/20 text-red-400 border-red-500/30',
}

export const knowledgeCategoryLabels: Record<KnowledgeCategory, string> = createI18nRecord({
  technique: 'knowledge.category_technique',
  guide: 'knowledge.category_guide',
  rehab: 'knowledge.category_rehab',
})
