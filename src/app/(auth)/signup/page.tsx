// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { signupSchema, type SignupInput } from '@/lib/validations/auth'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { PasswordInput } from '@/components/forms/PasswordInput'

// export default function SignupPage() {
//   const router = useRouter()
//   const [error, setError] = useState<string>('')
//   const [isLoading, setIsLoading] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<SignupInput>({
//     resolver: zodResolver(signupSchema),
//     defaultValues: {
//       role: 'owner',
//     },
//   })

//   const passwordValue = watch('password', '')

//   const onSubmit = async (data: SignupInput) => {
//     setIsLoading(true)
//     setError('')

//     try {
//       const response = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       })

//       const result = await response.json()

//       if (!response.ok) {
//         if (result.details) {
//           const errorMessages = result.details
//             .map((detail: any) => detail.message)
//             .join(', ')
//           throw new Error(errorMessages)
//         }
//         throw new Error(result.error || 'Failed to create account')
//       }

//       router.push('/login?registered=true')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Card className="w-full">
//       <CardHeader className="space-y-1">
//         <div className="flex justify-center mb-4">
//           <div className="text-4xl font-bold">
//             <span className="text-slate-900">Menu</span>
//             <span className="text-blue-600">Scan</span>
//           </div>
//         </div>
//         <CardTitle className="text-2xl font-bold text-center">
//           Create an account
//         </CardTitle>
//         <CardDescription className="text-center">
//           Enter your information to get started with MenuScan
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name *</Label>
//             <Input
//               id="name"
//               placeholder="John Doe"
//               {...register('name')}
//               disabled={isLoading}
//               autoComplete="name"
//             />
//             {errors.name && (
//               <p className="text-sm text-red-500">{errors.name.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email *</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="john@example.com"
//               {...register('email')}
//               disabled={isLoading}
//               autoComplete="email"
//             />
//             {errors.email && (
//               <p className="text-sm text-red-500">{errors.email.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone (Optional)</Label>
//             <Input
//               id="phone"
//               type="tel"
//               placeholder="03001234567"
//               {...register('phone')}
//               disabled={isLoading}
//               autoComplete="tel"
//             />
//             {errors.phone && (
//               <p className="text-sm text-red-500">{errors.phone.message}</p>
//             )}
//             <p className="text-xs text-slate-500">Pakistani phone number format</p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="password">Password *</Label>
//             <PasswordInput
//               id="password"
//               value={passwordValue}
//               onChange={(e) => {
//                 register('password').onChange(e)
//               }}
//               disabled={isLoading}
//               showStrength={true}
//             />
//             {errors.password && (
//               <p className="text-sm text-red-500">{errors.password.message}</p>
//             )}
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 Creating account...
//               </div>
//             ) : (
//               'Create account'
//             )}
//           </Button>
//         </form>
//       </CardContent>

//       <CardFooter className="flex flex-col space-y-2">
//         <div className="text-sm text-center text-slate-600">
//           Already have an account?{' '}
//           <Link href="/login" className="text-blue-600 hover:underline font-medium">
//             Sign in
//           </Link>
//         </div>
//         <div className="text-xs text-center text-slate-500">
//           By signing up, you agree to our Terms of Service
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { Store, User, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="text-4xl font-bold">
            <span className="text-slate-900">Menu</span>
            <span className="text-blue-600">Scan</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Choose Account Type
        </CardTitle>
        <CardDescription className="text-center">
          Select how you want to use MenuScan
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Restaurant Owner Option */}
        <Link href="/signup/restaurant" className="block">
          <div className="group flex items-center gap-4 p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Store className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900">Restaurant Owner</h3>
              <p className="text-sm text-slate-600">
                Manage your restaurant, menu, orders, tables, and more
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🎉 100 Free Credits
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Free Plan Available
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Customer Option (Disabled) */}
        <div className="flex items-center gap-4 p-6 border-2 border-slate-200 rounded-lg bg-slate-50 opacity-60">
          <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center">
            <User className="w-7 h-7 text-slate-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-700">Customer</h3>
            <p className="text-sm text-slate-600">
              No account needed - just scan QR codes to order food!
            </p>
            <p className="text-xs text-slate-500 mt-2">
              💡 Scan any restaurant's QR code to start ordering
            </p>
          </div>
        </div>

        {/* Super Admin Option (Disabled) */}
        <div className="flex items-center gap-4 p-6 border-2 border-slate-200 rounded-lg bg-slate-50 opacity-60">
          <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center">
            <svg
              className="w-7 h-7 text-slate-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-700">Super Admin</h3>
            <p className="text-sm text-slate-600">
              Platform administration - Invitation only
            </p>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center pt-4 border-t">
          <div className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}