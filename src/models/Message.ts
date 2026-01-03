import mongoose, { Document, Schema, Model } from 'mongoose'

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId
  restaurantId: mongoose.Types.ObjectId
  tableId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  senderType: 'customer' | 'owner' | 'staff'
  senderName: string
  senderId?: mongoose.Types.ObjectId
  message: string
  isRead: boolean
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
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
    senderType: {
      type: String,
      enum: ['customer', 'owner', 'staff'],
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1000, 'Message must be less than 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
messageSchema.index({ restaurantId: 1, sessionId: 1, createdAt: -1 })
messageSchema.index({ tableId: 1, createdAt: -1 })
messageSchema.index({ isRead: 1 })

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema)

export default Message