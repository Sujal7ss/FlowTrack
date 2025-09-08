/**
 * Transaction model for managing financial transactions.
 *
 * This module defines the Mongoose schema and interface for transactions,
 * including fields for user association, transaction type, amount, and related data.
 */

import mongoose from 'mongoose';

/**
 * Interface representing a Transaction document in the database.
 */
export interface ITransaction extends mongoose.Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who owns the transaction
  type: 'expense' | 'income'; // Type of transaction
  amount: number; // Transaction amount
  currency: string; // Currency code (e.g., 'INR')
  category?: string; // Optional category for the transaction
  description?: string; // Optional description
  date: Date; // Date of the transaction
  receiptId?: mongoose.Types.ObjectId; // Optional reference to a receipt
}

/**
 * Mongoose schema for the Transaction model.
 */
const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    category: {
      type: String
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Receipt'
    }
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
