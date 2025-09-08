/**
 * Transaction routes for handling transaction-related endpoints.
 *
 * This module defines the Express router for transaction operations,
 * including creating, listing, retrieving, updating, and deleting transactions.
 * All routes are protected with authentication middleware.
 */

import { Router } from 'express';
import {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Create a new transaction
router.post('/', requireAuth, createTransaction);

// List transactions with pagination and filtering
router.get('/', requireAuth, listTransactions);

// Get a specific transaction by ID
router.get('/:id', requireAuth, getTransaction);

// Update a specific transaction by ID
router.put('/:id', requireAuth, updateTransaction);

// Delete a specific transaction by ID
router.delete('/:id', requireAuth, deleteTransaction);

export default router;
