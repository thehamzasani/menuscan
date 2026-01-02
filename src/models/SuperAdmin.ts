import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ISuperAdmin extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  role: 'super_admin'
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'super_admin',
      immutable: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent password from being returned
// superAdminSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password
//     return ret
//   },
// })

superAdminSchema.set('toJSON', {
  transform: function (doc, ret) {
    const { password, ...rest } = ret
    return rest
  },
})

const SuperAdmin: Model<ISuperAdmin> =
  mongoose.models.SuperAdmin || mongoose.model<ISuperAdmin>('SuperAdmin', superAdminSchema)

export default SuperAdmin