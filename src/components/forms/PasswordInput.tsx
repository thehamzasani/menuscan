'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  showStrength?: boolean
}

export function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  disabled = false,
  id = 'password',
  name = 'password',
  showStrength = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 1, label: 'Too short', color: 'bg-red-500' }
    if (password.length < 8) return { strength: 2, label: 'Weak', color: 'bg-orange-500' }
    if (password.length < 12) return { strength: 3, label: 'Good', color: 'bg-yellow-500' }
    return { strength: 4, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = showStrength ? getPasswordStrength(value) : null

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value && passwordStrength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= passwordStrength.strength
                    ? passwordStrength.color
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-600">{passwordStrength.label}</p>
        </div>
      )}
    </div>
  )
}