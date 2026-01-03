import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IWaiterCall extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  tableId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  reason: 'service' | 'bill' | 'help' | 'water' | 'other'
  customReason?: string
  status: 'pending' | 'acknowledged' | 'completed' | 'cancelled'
  acknowledgedBy?: mongoose.Types.ObjectId
  acknowledgedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const waiterCallSchema = new Schema<IWaiterCall>(
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
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    reason: {
      type: String,
      enum: ['service', 'bill', 'help', 'water', 'other'],
      required: true,
    },
    customReason: {
      type: String,
      maxlength: [200, 'Custom reason must be less than 200 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'acknowledged', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    acknowledgedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
waiterCallSchema.index({ restaurantId: 1, status: 1 })
waiterCallSchema.index({ tableId: 1, status: 1 })
waiterCallSchema.index({ createdAt: -1 })

const WaiterCall: Model<IWaiterCall> =
  mongoose.models.WaiterCall || mongoose.model<IWaiterCall>('WaiterCall', waiterCallSchema)

export default WaiterCall