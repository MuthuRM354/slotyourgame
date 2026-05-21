import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export const metadata = { title: 'Register — SlotYourGame' }

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400">SlotYourGame</h1>
          <p className="text-gray-400 mt-1">Create your account</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
