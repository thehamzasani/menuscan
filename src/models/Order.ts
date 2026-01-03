import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  tableId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  orderNumber: string
  items: Array<{
    menuItemId: mongoose.Types.ObjectId
    name: string
    price: number
    quantity: number
    customizations: Array<{
      name: string
      selectedOptions: string[]
    }>
    specialInstructions?: string
    subtotal: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'
  specialInstructions?: string
  placedAt: Date
  confirmedAt?: Date
  preparedAt?: Date
  servedAt?: Date
  estimatedPrepTime?: number
  createdAt: Date
  updatedAt: Date
}

const orderSchema = new Schema<IOrder>(
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
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [
      {
        menuItemId: {
          type: Schema.Types.ObjectId,
          ref: 'MenuItem',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        customizations: [
          {
            name: String,
            selectedOptions: [String],
          },
        ],
        specialInstructions: String,
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
      default: 'pending',
      index: true,
    },
    specialInstructions: {
      type: String,
      maxlength: [500, 'Instructions must be less than 500 characters'],
    },
    placedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    confirmedAt: Date,
    preparedAt: Date,
    servedAt: Date,
    estimatedPrepTime: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
orderSchema.index({ restaurantId: 1, status: 1 })
orderSchema.index({ tableId: 1, status: 1 })
orderSchema.index({ sessionId: 1 })
orderSchema.index({ placedAt: -1 })
orderSchema.index({ orderNumber: 1 })

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order