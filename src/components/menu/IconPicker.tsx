import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Coffee,
  Pizza,
  Soup,
  Beef,
  Fish,
  Salad,
  IceCream,
  Wine,
  Beer,
  Cake,
  Sandwich,
  Cookie,
  Apple,
  Croissant,
  Drumstick,
  Egg,
  Milk,
  Popcorn,
  CupSoda,
  Candy,
  X,
} from 'lucide-react'

const icons = [
  { name: 'Coffee', component: Coffee, label: 'Coffee & Tea' },
  { name: 'Pizza', component: Pizza, label: 'Pizza' },
  { name: 'Soup', component: Soup, label: 'Soup' },
  { name: 'Beef', component: Beef, label: 'Meat' },
  { name: 'Fish', component: Fish, label: 'Seafood' },
  { name: 'Salad', component: Salad, label: 'Salads' },
  { name: 'IceCream', component: IceCream, label: 'Desserts' },
  { name: 'Wine', component: Wine, label: 'Wine' },
  { name: 'Beer', component: Beer, label: 'Beer' },
  { name: 'Cake', component: Cake, label: 'Cakes' },
  { name: 'Sandwich', component: Sandwich, label: 'Sandwiches' },
  { name: 'Cookie', component: Cookie, label: 'Cookies' },
  { name: 'Apple', component: Apple, label: 'Fruits' },
  { name: 'Croissant', component: Croissant, label: 'Bakery' },
  { name: 'Drumstick', component: Drumstick, label: 'Chicken' },
  { name: 'Egg', component: Egg, label: 'Breakfast' },
  { name: 'Milk', component: Milk, label: 'Dairy' },
  { name: 'Popcorn', component: Popcorn, label: 'Snacks' },
  { name: 'CupSoda', component: CupSoda, label: 'Beverages' },
  { name: 'Candy', component: Candy, label: 'Sweets' },
]

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  const selectedIcon = icons.find((icon) => icon.name === value)
  const SelectedIconComponent = selectedIcon?.component

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setOpen(false)
  }

  return (
    <div>
      <Button 
        variant="outline" 
        type="button" 
        className="w-full justify-start"
        onClick={() => setOpen(true)}
      >
        {SelectedIconComponent ? (
          <div className="flex items-center gap-2">
            <SelectedIconComponent className="h-5 w-5" />
            <span>{selectedIcon.label}</span>
          </div>
        ) : (
          <span className="text-slate-500">Select an icon...</span>
        )}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Choose Icon</h3>
                <p className="text-sm text-slate-600">Select an icon for your category</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {icons.map((icon) => {
                const IconComponent = icon.component
                const isSelected = value === icon.name
                return (
                  <button
                    key={icon.name}
                    onClick={() => handleSelect(icon.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:bg-slate-50 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200'
                    }`}
                    type="button"
                  >
                    <IconComponent className={`h-6 w-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                    <span className="text-xs text-center line-clamp-1">
                      {icon.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}