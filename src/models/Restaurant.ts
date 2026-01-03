import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IRestaurant extends Document {
  _id: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  name: string
  slug: string
  description?: string
  logo?: string
  coverImage?: string
  address: {
    street: string
    city: string
    area: string
    phone: string
  }
  settings: {
    currency: string
    language: string
    theme: {
      primaryColor: string
      secondaryColor: string
    }
    openingHours: Array<{
      day: string
      open: string
      close: string
      closed: boolean
    }>
  }
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise'
    status: 'active' | 'suspended' | 'cancelled'
    freeCredits: number
    paidCredits: number
    startDate?: Date
    endDate?: Date
    autoRenew: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description must be less than 500 characters'],
    },
    logo: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      area: {
        type: String,
        required: [true, 'Area is required'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^(\+92|0)?3[0-9]{9}$/, 'Please enter a valid Pakistani phone number'],
      },
    },
    settings: {
      currency: {
        type: String,
        default: 'PKR',
      },
      language: {
        type: String,
        default: 'en',
        enum: ['en', 'ur'],
      },
      theme: {
        primaryColor: {
          type: String,
          default: '#3b82f6',
        },
        secondaryColor: {
          type: String,
          default: '#8b5cf6',
        },
      },
      openingHours: [
        {
          day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          },
          open: String,
          close: String,
          closed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'basic', 'pro', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'suspended', 'cancelled'],
        default: 'active',
      },
      freeCredits: {
        type: Number,
        default: 100,
      },
      paidCredits: {
        type: Number,
        default: 0,
      },
      startDate: Date,
      endDate: Date,
      autoRenew: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
restaurantSchema.index({ ownerId: 1 })
restaurantSchema.index({ slug: 1 })
restaurantSchema.index({ isActive: 1 })

const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', restaurantSchema)

export default Restaurant