import mongoose from 'mongoose';

export interface ITransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: 'expense' | 'income';
  amount: number;
  currency: string;
  category?: string;
  description?: string;
  date: Date;
  receiptId?: mongoose.Types.ObjectId;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  category: { type: String },
  description: { type: String },
  date: { type: Date, default: Date.now },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
