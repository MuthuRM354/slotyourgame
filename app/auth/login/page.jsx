import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = { title: 'Sign In — SlotYourGame' }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400">SlotYourGame</h1>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500">
          No account?{' '}
          <Link href="/auth/register" className="text-green-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}
