import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const Home = lazy(() => import('./pages/Home'))
const Courses = lazy(() => import('./pages/Courses'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const Exercises = lazy(() => import('./pages/Exercises'))
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'))
const Plans = lazy(() => import('./pages/Plans'))
const PlanDetail = lazy(() => import('./pages/PlanDetail'))
const Login = lazy(() => import('./pages/Login'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const Knowledge = lazy(() => import('./pages/Knowledge'))
const KnowledgeArticle = lazy(() => import('./pages/KnowledgeArticle'))
const Records = lazy(() => import('./pages/Records'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

import { useTranslation } from 'react-i18next'

function PageLoading() {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-zinc-600 text-sm">
      {t('common.loading')}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
          <Navbar />
          <ScrollToTop />
          <main className="flex-1">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:id" element={<ExerciseDetail />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/plans/:id" element={<PlanDetail />} />
                <Route path="/knowledge" element={<Knowledge />} />
                <Route path="/knowledge/:id" element={<KnowledgeArticle />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/records" element={<Records />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
        </main>
        <Footer />
        <Toaster position="top-center" richColors theme="dark" />
      </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
