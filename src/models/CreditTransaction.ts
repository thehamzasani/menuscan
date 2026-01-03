import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ICreditTransaction extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  type: 'purchase' | 'admin_grant' | 'usage' | 'refund'
  amount: number
  description: string
  grantedBy?: mongoose.Types.ObjectId
  previousBalance: number
  newBalance: number
  createdAt: Date
  updatedAt: Date
}

const creditTransactionSchema = new Schema<ICreditTransaction>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['purchase', 'admin_grant', 'usage', 'refund'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: [200, 'Description must be less than 200 characters'],
    },
    grantedBy: {
      type: Schema.Types.ObjectId,
      ref: 'SuperAdmin',
    },
    previousBalance: {
      type: Number,
      required: true,
      min: 0,
    },
    newBalance: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
creditTransactionSchema.index({ restaurantId: 1, createdAt: -1 })
creditTransactionSchema.index({ type: 1 })

const CreditTransaction: Model<ICreditTransaction> =
  mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>('CreditTransaction', creditTransactionSchema)

export default CreditTransaction