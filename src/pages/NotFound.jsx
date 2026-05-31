import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-4">🏏</p>
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-gray-400 mb-8">This page is out for a duck.</p>
      <Link
        to={ROUTES.HOME}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
