import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  phone?: string
  role: 'owner' | 'staff' | 'super_admin'
  restaurantId?: mongoose.Types.ObjectId
  permissions?: string[]
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be less than 50 characters'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^(\+92|0)?3[0-9]{9}$/, 'Please enter a valid Pakistani phone number'],
    },
    role: {
      type: String,
      enum: ['owner', 'staff', 'super_admin'],
      default: 'owner',
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    permissions: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ restaurantId: 1 })
userSchema.index({ role: 1 })

// Prevent password from being returned in queries by default
// userSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password
//     return ret
//   },
// })

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    const { password, ...rest } = ret
    return rest
  },
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User 