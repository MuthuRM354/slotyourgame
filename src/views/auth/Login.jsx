import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || ROUTES.HOME

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  async function onSubmit(data) {
    const result = await login(data)
    if (result.success) {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-blue-400 hover:underline">
              Register
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
