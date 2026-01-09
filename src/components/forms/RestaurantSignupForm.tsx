// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
// import { Progress } from '@/components/ui/progress'
// import { Separator } from '@/components/ui/separator'
// import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
// import { completeRegistrationSchema } from '@/lib/validations/restaurant'
// import { PasswordInput } from '@/components/forms/PasswordInput'
// import { z } from 'zod'

// type FormData = z.infer<typeof completeRegistrationSchema>

// const steps = [
//   { id: 1, title: 'Owner Details', description: 'Your personal information' },
//   { id: 2, title: 'Restaurant Info', description: 'Tell us about your restaurant' },
//   { id: 3, title: 'Settings', description: 'Customize your preferences' },
// ]

// const cities = [
//   'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
//   'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala'
// ]

// export default function RestaurantSignupForm() {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const {
//     register,
//     handleSubmit,
//     watch,
//     trigger,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(completeRegistrationSchema),
//     defaultValues: {
//       currency: 'PKR',
//       language: 'en',
//       primaryColor: '#3b82f6',
//       secondaryColor: '#8b5cf6',
//     },
//   })

//   const passwordValue = watch('ownerPassword', '')

//   const progress = (currentStep / steps.length) * 100

//   const validateStep = async (step: number) => {
//     const fieldsToValidate: Record<number, (keyof FormData)[]> = {
//       1: ['ownerName', 'ownerEmail', 'ownerPassword'],
//       2: ['restaurantName', 'street', 'area', 'city', 'phone'],
//       3: ['currency', 'language', 'primaryColor', 'secondaryColor'],
//     }

//     const fields = fieldsToValidate[step]
//     const result = await trigger(fields)
//     return result
//   }

//   const handleNext = async () => {
//     const isValid = await validateStep(currentStep)
//     if (isValid) {
//       setCurrentStep((prev) => Math.min(prev + 1, steps.length))
//       setError('')
//     }
//   }

//   const handlePrevious = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1))
//     setError('')
//   }

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true)
//     setError('')

//     try {
//       const response = await fetch('/api/restaurants/create', {
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
//         throw new Error(result.error || 'Failed to create restaurant')
//       }

//       router.push('/login?registered=true&type=restaurant')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="w-full max-w-2xl">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-center mb-4">
//             <div className="text-3xl font-bold">
//               <span className="text-slate-900">Menu</span>
//               <span className="text-blue-600">Scan</span>
//             </div>
//           </div>
//           <CardTitle className="text-2xl text-center">
//             Create Your Restaurant Account
//           </CardTitle>
//           <CardDescription className="text-center">
//             Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <div className="mb-6">
//             <Progress value={progress} className="h-2" />
//             <div className="flex justify-between mt-2">
//               {steps.map((step) => (
//                 <div
//                   key={step.id}
//                   className={`flex flex-col items-center ${
//                     step.id <= currentStep ? 'text-blue-600' : 'text-slate-400'
//                   }`}
//                 >
//                   <div
//                     className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
//                       step.id < currentStep
//                         ? 'bg-blue-600 border-blue-600'
//                         : step.id === currentStep
//                         ? 'border-blue-600'
//                         : 'border-slate-300'
//                     }`}
//                   >
//                     {step.id < currentStep ? (
//                       <Check className="w-5 h-5 text-white" />
//                     ) : (
//                       <span className={step.id === currentStep ? 'text-blue-600 font-semibold' : ''}>
//                         {step.id}
//                       </span>
//                     )}
//                   </div>
//                   <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-4">
//             {error && (
//               <Alert variant="destructive">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             {currentStep === 1 && (
//               <div className="space-y-4 animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label htmlFor="ownerName">Your Full Name *</Label>
//                   <Input
//                     id="ownerName"
//                     placeholder="John Doe"
//                     {...register('ownerName')}
//                     autoComplete="name"
//                   />
//                   {errors.ownerName && (
//                     <p className="text-sm text-red-500">{errors.ownerName.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="ownerEmail">Email Address *</Label>
//                   <Input
//                     id="ownerEmail"
//                     type="email"
//                     placeholder="john@example.com"
//                     {...register('ownerEmail')}
//                     autoComplete="email"
//                   />
//                   {errors.ownerEmail && (
//                     <p className="text-sm text-red-500">{errors.ownerEmail.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="ownerPassword">Password *</Label>
//                   <PasswordInput
//                     id="ownerPassword"
//                     value={passwordValue}
//                     onChange={(e) => {
//                       register('ownerPassword').onChange(e)
//                     }}
//                     showStrength={true}
//                   />
//                   {errors.ownerPassword && (
//                     <p className="text-sm text-red-500">{errors.ownerPassword.message}</p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-4 animate-in fade-in-50 duration-300">
//                 <div className="space-y-2">
//                   <Label htmlFor="restaurantName">Restaurant Name *</Label>
//                   <Input
//                     id="restaurantName"
//                     placeholder="The Golden Spoon"
//                     {...register('restaurantName')}
//                   />
//                   {errors.restaurantName && (
//                     <p className="text-sm text-red-500">{errors.restaurantName.message}</p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description (Optional)</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Describe your restaurant..."
//                     rows={3}
//                     {...register('description')}
//                   />
//                   {errors.description && (
//                     <p className="text-sm text-red-500">{errors.description.message}</p>
//                   )}
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <Label htmlFor="street">Street Address *</Label>
//                   <Input
//                     id="street"
//                     placeholder="123 Main Street"
//                     {...register('street')}
//                   />
//                   {errors.street && (
//                     <p className="text-sm text-red-500">{errors.street.message}</p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="area">Area *</Label>
//                     <Input
//                       id="area"
//                       placeholder="DHA Phase 5"
//                       {...register('area')}
//                     />
//                     {errors.area && (
//                       <p className="text-sm text-red-500">{errors.area.message}</p>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="city">City *</Label>
//                     <select
//                       id="city"
//                       className="w-full px-3 py-2 border rounded-md"
//                       {...register('city')}
//                     >
//                       <option value="">Select City</option>
//                       {cities.map((city) => (
//                         <option key={city} value={city}>
//                           {city}
//                         </option>
//                       ))}
//                     </select>
//                     {errors.city && (
//                       <p className="text-sm text-red-500">{errors.city.message}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number *</Label>
//                   <Input
//                     id="phone"
//                     type="tel"
//                     placeholder="03001234567"
//                     {...register('phone')}
//                   />
//                   {errors.phone && (
//                     <p className="text-sm text-red-500">{errors.phone.message}</p>
//                   )}
//                   <p className="text-xs text-slate-500">Pakistani format: 03XXXXXXXXX</p>
//                 </div>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-4 animate-in fade-in-50 duration-300">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="currency">Currency</Label>
//                     <select
//                       id="currency"
//                       className="w-full px-3 py-2 border rounded-md"
//                       {...register('currency')}
//                     >
//                       <option value="PKR">PKR - Pakistani Rupee</option>
//                       <option value="USD">USD - US Dollar</option>
//                     </select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="language">Language</Label>
//                     <select
//                       id="language"
//                       className="w-full px-3 py-2 border rounded-md"
//                       {...register('language')}
//                     >
//                       <option value="en">English</option>
//                       <option value="ur">اردو (Urdu)</option>
//                     </select>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="space-y-2">
//                   <Label>Theme Colors</Label>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="primaryColor" className="text-sm">Primary Color</Label>
//                       <div className="flex gap-2">
//                         <Input
//                           id="primaryColor"
//                           type="color"
//                           className="w-16 h-10"
//                           {...register('primaryColor')}
//                         />
//                         <Input
//                           type="text"
//                           value={watch('primaryColor')}
//                           readOnly
//                           className="flex-1"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="secondaryColor" className="text-sm">Secondary Color</Label>
//                       <div className="flex gap-2">
//                         <Input
//                           id="secondaryColor"
//                           type="color"
//                           className="w-16 h-10"
//                           {...register('secondaryColor')}
//                         />
//                         <Input
//                           type="text"
//                           value={watch('secondaryColor')}
//                           readOnly
//                           className="flex-1"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <Alert className="bg-blue-50 border-blue-200">
//                   <AlertDescription className="text-blue-900">
//                     <strong>🎉 Great news!</strong> You'll get 100 free credits to start with!
//                   </AlertDescription>
//                 </Alert>
//               </div>
//             )}

//             <div className="flex justify-between pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handlePrevious}
//                 disabled={currentStep === 1 || isLoading}
//               >
//                 <ChevronLeft className="mr-2 h-4 w-4" />
//                 Previous
//               </Button>

//               {currentStep < steps.length ? (
//                 <Button type="button" onClick={handleNext} disabled={isLoading}>
//                   Next
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Button>
//               ) : (
//                 <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="mr-2 h-4 w-4" />
//                       Complete Registration
//                     </>
//                   )}
//                 </Button>
//               )}
//             </div>
//           </div>
//         </CardContent>

//         <CardFooter className="flex flex-col space-y-2">
//           <div className="text-sm text-center text-slate-600">
//             Already have an account?{' '}
//             <a href="/login" className="text-blue-600 hover:underline font-medium">
//               Sign in
//             </a>
//           </div>
//           <div className="text-xs text-center text-slate-500">
//             By signing up, you agree to our Terms of Service
//           </div>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { completeRegistrationSchema } from '@/lib/validations/restaurant'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { z } from 'zod'

type FormData = z.infer<typeof completeRegistrationSchema>

const steps = [
  { id: 1, title: 'Owner Details', description: 'Your personal information' },
  { id: 2, title: 'Restaurant Info', description: 'Tell us about your restaurant' },
  { id: 3, title: 'Settings', description: 'Customize your preferences' },
]

const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
]

export default function RestaurantSignupForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      ownerName: '',
      ownerEmail: '',
      ownerPassword: '',
      restaurantName: '',
      street: '',
      area: '',
      city: '',
      phone: '',
      description: '',
      currency: 'PKR',
      language: 'en',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
    },
  })

  const progress = (currentStep / steps.length) * 100

  const validateStep = async (step: number) => {
    const fieldsToValidate: Record<number, (keyof FormData)[]> = {
      1: ['ownerName', 'ownerEmail', 'ownerPassword'],
      2: ['restaurantName', 'street', 'area', 'city', 'phone'],
      3: ['currency', 'language', 'primaryColor', 'secondaryColor'],
    }

    return trigger(fieldsToValidate[step])
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      setError('')
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError('')
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/restaurants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create restaurant')
      }

      router.push('/login?registered=true&type=restaurant')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // const onSubmit = async (data: FormData) => {
  //   setIsLoading(true)
  //   setError('')

  //   try {
  //     const response = await fetch('/api/restaurants/create', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(data),
  //     })

  //     // Check if response is JSON 
  //     // const contentType = response.headers.get('content-type')
  //     // if (!contentType || !contentType.includes('application/json')) {
  //     //   throw new Error('Server returned an invalid response. Please try again.')
  //     // }
  //     //?Testing
  //     const rawText = await response.text()
  //     console.error('RAW SERVER RESPONSE:', rawText)

  //     throw new Error('Server returned an invalid response. Check console.')

  //     const result = await response.json()

  //     if (!response.ok) {
  //       if (result.details) {
  //         const errorMessages = result.details
  //           .map((detail: any) => detail.message)
  //           .join(', ')
  //         throw new Error(errorMessages)
  //       }
  //       throw new Error(result.error || 'Failed to create restaurant')
  //     }

  //     router.push('/login?registered=true&type=restaurant')
  //   } catch (err) {
  //     console.error('Signup error:', err)
  //     setError(err instanceof Error ? err.message : 'Something went wrong')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <div className="text-3xl font-bold text-center">
            <span className="text-slate-900">Menu</span>
            <span className="text-blue-600">Scan</span>
          </div>
          <CardTitle className="text-2xl text-center">
            Create Your Restaurant Account
          </CardTitle>
          <CardDescription className="text-center">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Progress value={progress} className="h-2 mb-6" />

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Your Full Name *</Label>
                <Input {...register('ownerName')} />
                {errors.ownerName && (
                  <p className="text-sm text-red-500">{errors.ownerName.message}</p>
                )}
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input type="email" {...register('ownerEmail')} />
                {errors.ownerEmail && (
                  <p className="text-sm text-red-500">{errors.ownerEmail.message}</p>
                )}
              </div>

              <div>
                <Label>Password *</Label>
                <Controller
                  name="ownerPassword"
                  control={control}
                  render={({ field }) => (
                    <PasswordInput
                      id="ownerPassword"
                      value={field.value}
                      onChange={field.onChange}

                      showStrength
                    />
                  )}
                />
                {errors.ownerPassword && (
                  <p className="text-sm text-red-500">{errors.ownerPassword.message}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Input placeholder="Restaurant Name" {...register('restaurantName')} />
              <Textarea placeholder="Description" {...register('description')} />
              <Input placeholder="Street" {...register('street')} />
              <Input placeholder="Area" {...register('area')} />

              <select className="w-full border rounded-md p-2" {...register('city')}>
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <Input placeholder="Phone" {...register('phone')} />
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <select className="w-full border rounded-md p-2" {...register('currency')}>
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
              </select>

              <select className="w-full border rounded-md p-2" {...register('language')}>
                <option value="en">English</option>
                <option value="ur">Urdu</option>
              </select>

              <Input type="color" {...register('primaryColor')} />
              <Input type="color" {...register('secondaryColor')} />
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
