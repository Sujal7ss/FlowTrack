import mongoose from 'mongoose';

export interface IReceipt extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  filePath: string;
  mime: string;
  size: number;
  status: 'processing' | 'done' | 'failed';
  extracted?: any; // free-form JSON: merchant/date/total/items/rawText
  errorMessage?: string;
}

const ReceiptSchema = new mongoose.Schema<IReceipt>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filePath: { type: String, required: true },
  mime: { type: String },
  size: { type: Number },
  status: { type: String, enum: ['processing', 'done', 'failed'], default: 'processing' },
  extracted: { type: mongoose.Schema.Types.Mixed },
  errorMessage: { type: String }
}, { timestamps: true });

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);
