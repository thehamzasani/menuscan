import mongoose, { Document, Schema, Model } from 'mongoose'

export interface ITable extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  tableNumber: string
  qrCodeUrl: string
  qrCodeData: string
  location: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  currentSessionId?: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const tableSchema = new Schema<ITable>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
    qrCodeData: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'indoor',
      enum: ['indoor', 'outdoor', 'rooftop', 'patio', 'balcony'],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'Capacity must be at least 1'],
      max: [20, 'Capacity cannot exceed 20'],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    currentSessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
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

// Compound index for unique table numbers per restaurant
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true })
tableSchema.index({ status: 1 })

const Table: Model<ITable> = mongoose.models.Table || mongoose.model<ITable>('Table', tableSchema)

export default Table