import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  name: string
  nameUrdu?: string
  description?: string
  icon?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new Schema<ICategory>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Name must be less than 50 characters'],
    },
    nameUrdu: {
      type: String,
      trim: true,
      maxlength: [50, 'Urdu name must be less than 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description must be less than 200 characters'],
    },
    icon: {
      type: String,
    },
    sortOrder: {
      type: Number,
      default: 0,
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
categorySchema.index({ restaurantId: 1, sortOrder: 1 })
categorySchema.index({ isActive: 1 })

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)

export default Category