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
  Utensils,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
}

interface CategoryIconProps {
  icon?: string
  className?: string
}

export default function CategoryIcon({ icon, className = 'h-5 w-5' }: CategoryIconProps) {
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : Utensils
  return <IconComponent className={className} />
}