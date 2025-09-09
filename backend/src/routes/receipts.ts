/**
 * Receipt routes for handling receipt-related endpoints.
 *
 * This module defines the Express router for receipt operations,
 * including uploading and parsing receipt files.
 */

import { Router } from 'express';
import { uploadReceipt, uploadMiddleware } from '../controllers/receiptController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Upload and parse receipt
router.post('/upload', requireAuth, uploadMiddleware, uploadReceipt);

export default router;
