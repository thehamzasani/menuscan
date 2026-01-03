import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  tableId: mongoose.Types.ObjectId
  customerName?: string
  startTime: Date
  endTime?: Date
  status: 'active' | 'completed' | 'abandoned'
  totalAmount: number
  orders: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema<ISession>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    tableId: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Indexes
sessionSchema.index({ restaurantId: 1, status: 1 })
sessionSchema.index({ tableId: 1, status: 1 })
sessionSchema.index({ startTime: -1 })

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema)

export default Session