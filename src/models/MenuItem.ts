import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  categoryId: mongoose.Types.ObjectId
  name: string
  nameUrdu?: string
  description: string
  descriptionUrdu?: string
  price: number
  images: string[]
  isAvailable: boolean
  isPopular: boolean
  preparationTime: number
  dietaryInfo: {
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    isSpicy: boolean
    spicyLevel?: number
    allergens: string[]
  }
  customizations: Array<{
    name: string
    required: boolean
    multiSelect: boolean
    options: Array<{
      name: string
      price: number
    }>
  }>
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    nameUrdu: {
      type: String,
      trim: true,
      maxlength: [100, 'Urdu name must be less than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    descriptionUrdu: {
      type: String,
      maxlength: [500, 'Urdu description must be less than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      default: 15,
      min: [0, 'Preparation time cannot be negative'],
    },
    dietaryInfo: {
      isVegetarian: {
        type: Boolean,
        default: false,
      },
      isVegan: {
        type: Boolean,
        default: false,
      },
      isGlutenFree: {
        type: Boolean,
        default: false,
      },
      isSpicy: {
        type: Boolean,
        default: false,
      },
      spicyLevel: {
        type: Number,
        min: 0,
        max: 5,
      },
      allergens: {
        type: [String],
        default: [],
      },
    },
    customizations: [
      {
        name: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
        multiSelect: {
          type: Boolean,
          default: false,
        },
        options: [
          {
            name: {
              type: String,
              required: true,
            },
            price: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
menuItemSchema.index({ restaurantId: 1, categoryId: 1 })
menuItemSchema.index({ isAvailable: 1 })
menuItemSchema.index({ isPopular: 1 })
menuItemSchema.index({ sortOrder: 1 })

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', menuItemSchema)

export default MenuItem