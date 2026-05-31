import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/utils/constants'

const schema = yup.object({
  fullName: yup.string().min(2, 'At least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').required('Phone is required'),
  password: yup
    .string()
    .min(8, 'At least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[a-z]/, 'Must contain a lowercase letter')
    .matches(/[0-9]/, 'Must contain a digit')
    .required('Password is required'),
  role: yup.string().oneOf(['PLAYER', 'CAPTAIN', 'SCORER', 'VENUE_OWNER']).required(),
})

const ROLES = [
  { value: 'PLAYER', label: 'Player — Book turfs, join games' },
  { value: 'CAPTAIN', label: 'Captain — Lead your team' },
  { value: 'SCORER', label: 'Scorer — Track match stats' },
  { value: 'VENUE_OWNER', label: 'Venue Owner — List your turf' },
]

export default function Register() {
  const { register: registerUser, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.HOME, { replace: true })
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'PLAYER' },
  })

  async function onSubmit(data) {
    const result = await registerUser(data)
    if (result.success) {
      toast.success('Account created! Welcome to SlotYourGame.')
      navigate(ROUTES.HOME)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-blue-400 hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Full Name</label>
              <input
                {...register('fullName')}
                placeholder="Virat Kumar"
                className="input"
              />
              {errors.fullName && <p className="error">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="input"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Mobile Number</label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="9876543210"
                className="input"
              />
              {errors.phone && <p className="error">{errors.phone.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">I am a…</label>
              <select {...register('role')} className="input">
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="Min 8 chars, upper+lower+digit"
                className="input"
              />
              {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
