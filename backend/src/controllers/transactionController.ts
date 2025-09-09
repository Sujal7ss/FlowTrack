/**
 * Transaction controller handling CRUD operations for user transactions.
 *
 * This module provides controller functions for creating, listing, retrieving,
 * updating, and deleting transactions associated with authenticated users.
 */

import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

/**
 * Creates a new transaction for the authenticated user.
 *
 * Validates input data, creates the transaction in the database,
 * and returns the created transaction.
 *
 * @param req - The Express request object containing transaction data in the body.
 * @param res - The Express response object.
 * @returns A JSON response with the created transaction or an error message.
 */
export const createTransaction = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { type, amount, currency = 'INR', category, description, date, receiptId } = req.body;

  if (!type || !['expense', 'income'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const tx = await Transaction.create({
    userId,
    type,
    amount,
    currency,
    category,
    description,
    date: date ? new Date(date) : new Date(),
    receiptId
  });

  return res.status(201).json(tx);
};

/**
 * Lists transactions for the authenticated user with pagination and filtering.
 *
 * Supports query parameters for pagination (page, limit), date range (start, end),
 * and category filtering.
 *
 * @param req - The Express request object with query parameters.
 * @param res - The Express response object.
 * @returns A JSON response with transaction data and metadata.
 */
export const listTransactions = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = Math.max(1, parseInt(String(req.query.page || '1')));
  const limit = Math.min(100, parseInt(String(req.query.limit || '20')));
  const skip = (page - 1) * limit;
  const filter: any = { userId };

  if (req.query.start) {
    filter.date = { ...filter.date, $gte: new Date(String(req.query.start)) };
  }

  if (req.query.end) {
    filter.date = { ...filter.date, $lte: new Date(String(req.query.end)) };
  }

  if(req.query.type){
    filter.type = String(req.query.type);
  }
  if (req.query.category) {
    filter.category = String(req.query.category);
  }

  const [data, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(filter)
  ]);

  res.json({ data, meta: { page, limit, total } });
};

/**
 * Retrieves a specific transaction by ID for the authenticated user.
 *
 * @param req - The Express request object with transaction ID in params.
 * @param res - The Express response object.
 * @returns A JSON response with the transaction or an error message.
 */
export const getTransaction = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tx = await Transaction.findOne({ _id: req.params.id, userId }).lean();

  if (!tx) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(tx);
};

/**
 * Updates a specific transaction by ID for the authenticated user.
 *
 * @param req - The Express request object with transaction ID in params and update data in body.
 * @param res - The Express response object.
 * @returns A JSON response with the updated transaction or an error message.
 */
export const updateTransaction = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const updated = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId },
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(updated);
};

/**
 * Deletes a specific transaction by ID for the authenticated user.
 *
 * @param req - The Express request object with transaction ID in params.
 * @param res - The Express response object.
 * @returns A 204 No Content response or an error message.
 */
export const deleteTransaction = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId });

  if (!deleted) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.status(204).send();
};

/**
 * Retrieves aggregated data for the authenticated user's transactions.
 *
 * Computes total income, total expense, net amount, category breakdown, and trend data.
 * Supports date range filtering via query parameters 'start' and 'end'.
 *
 * @param req - The Express request object with optional start and end query parameters.
 * @param res - The Express response object.
 * @returns A JSON response with aggregated transaction data.
 */
export const getAggregations = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const matchFilter: any = { userId: userId };

  // Add date range filtering if provided
  if (req.query.start) {
    matchFilter.date = { ...matchFilter.date, $gte: new Date(String(req.query.start)) };
  }
  if (req.query.end) {
    matchFilter.date = { ...matchFilter.date, $lte: new Date(String(req.query.end)) };
  }

  const aggregationResult = await Transaction.aggregate([
    { $match: matchFilter },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalIncome: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                }
              },
              totalExpense: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              totalIncome: 1,
              totalExpense: 1,
              netAmount: { $subtract: ['$totalIncome', '$totalExpense'] }
            }
          }
        ],
        categoryBreakdown: [
          {
            $group: {
              _id: '$category',
              amount: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              category: '$_id',
              amount: 1,
              count: 1
            }
          }
        ],
        trendData: [
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$date' }
              },
              income: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                }
              },
              expense: {
                $sum: {
                  $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                }
              }
            }
          },
          {
            $project: {
              _id: 0,
              date: '$_id',
              income: 1,
              expense: 1,
              net: { $subtract: ['$income', '$expense'] }
            }
          },
          { $sort: { date: 1 } }
        ]
      }
    }
  ]);

  const result = aggregationResult[0];

  // If no transactions, return empty aggregations
  if (!result) {
    return res.json({
      categoryBreakdown: [],
      trendData: [],
      summary: {
        totalIncome: 0,
        totalExpense: 0,
        netAmount: 0
      }
    });
  }

  res.json({
    categoryBreakdown: result.categoryBreakdown || [],
    trendData: result.trendData || [],
    summary: result.summary[0] || {
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0
    }
  });
};
