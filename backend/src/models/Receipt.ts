/**
 * Receipt model for managing uploaded receipt files and their processing.
 *
 * This module defines the Mongoose schema and interface for receipts,
 * including fields for file metadata, processing status, and extracted data.
 */

import mongoose from 'mongoose';

/**
 * Interface representing a Receipt document in the database.
 */
export interface IReceipt extends mongoose.Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who uploaded the receipt
  filePath: string; // Path to the uploaded file
  mime: string; // MIME type of the file
  size: number; // Size of the file in bytes
  status: 'processing' | 'done' | 'failed'; // Processing status of the receipt
  extracted?: any; // Extracted data from the receipt (free-form JSON)
  errorMessage?: string; // Error message if processing failed
}

/**
 * Mongoose schema for the Receipt model.
 */
const ReceiptSchema = new mongoose.Schema<IReceipt>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    mime: {
      type: String
    },
    size: {
      type: Number
    },
    status: {
      type: String,
      enum: ['processing', 'done', 'failed'],
      default: 'processing'
    },
    extracted: {
      type: mongoose.Schema.Types.Mixed
    },
    errorMessage: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);
