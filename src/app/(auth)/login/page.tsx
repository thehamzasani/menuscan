'use client'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form' // CHANGED: Added Controller
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordInput } from '@/components/forms/PasswordInput'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

//   useEffect(() => {
//   const checkSession = async () => {
//     const response = await fetch('/api/auth/session')
//     const session = await response.json()
//     console.log('Current session:', session)
//   }
//   checkSession()
// }, [])

// Add to existing useEffect
useEffect(() => {
  if (searchParams.get('registered') === 'true') {
    const type = searchParams.get('type')
    if (type === 'restaurant') {
      setSuccessMessage('Restaurant created successfully! You got 100 free credits. Please sign in.')
    } else {
      setSuccessMessage('Account created successfully! Please sign in.')
    }
  }
}, [searchParams])

  const {
    register,
    handleSubmit,
    control, 
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })


  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.')
    }
  }, [searchParams])

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // When signIn succeeds, fetch session to determine role and redirect accordingly
      if (result?.ok) {
        // small delay to ensure the session cookie is set
        await new Promise(resolve => setTimeout(resolve, 300))

        const sessionResponse = await fetch('/api/auth/session')
        const session = await sessionResponse.json()
        const role = session?.user?.role

        if (role === 'super_admin') {
          router.push('/super-admin/dashboard')
        } else {
          router.push('/dashboard')
        }

        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

// Todo Delete this and uncomment the above code
//   const onSubmit = async (data: LoginInput) => {
//   console.log('🔵 Form submitted with data:', data)
//   setIsLoading(true)
//   setError(null)

//   try {
//     console.log('🔵 Calling signIn...')
//     const result = await signIn('credentials', {
//       email: data.email,
//       password: data.password,
//       redirect: false,
//     })

//     console.log('🟢 Login result:', result)

//     if (result?.error) {
//       console.log('🔴 Login error:', result.error)
//       setError(result.error)
//       return
//     }

//     if (result?.ok) {
//       console.log('🟢 Login successful, fetching session...')
      
//       // Small delay to ensure session cookie is set
//       await new Promise(resolve => setTimeout(resolve, 500))
      
//       // Get the session
//       const sessionResponse = await fetch('/api/auth/session')
//       const session = await sessionResponse.json()
      
//       console.log('🟢 Session after login:', session)
//       console.log('🟢 User role:', session?.user?.role)
      
//       // Hard redirect based on role
//       if (session?.user?.role === 'super_admin') {
//         console.log('🟢 Redirecting to /super-admin')
//         window.location.href = '/super-admin'
//       } else if (session?.user?.role === 'owner' || session?.user?.role === 'staff') {
//         console.log('🟢 Redirecting to /dashboard')
//         window.location.href = '/dashboard'
//       } else {
//         console.log('🟡 Unknown role, redirecting to /dashboard')
//         window.location.href = '/dashboard'
//       }
//     } else {
//       console.log('🔴 Login not successful, result:', result)
//     }
//   } catch (err) {
//     console.error('🔴 Login error caught:', err)
//     setError(err instanceof Error ? err.message : 'An error occurred')
//   } finally {
//     console.log('🔵 Setting loading to false')
//     setIsLoading(false)
//   }
// }
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="text-4xl font-bold">
            <span className="text-slate-900">Menu</span>
            <span className="text-blue-600">Scan</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PasswordInput
                  id="password"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  showStrength={false}
                />
              )}
            />
            
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Create account
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}