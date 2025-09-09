import { Router } from 'express';
import authRouter from './auth';
import transactionRouter from './transactions';
import receiptRouter from './receipts';

const router = Router();

// Mount authentication routes
router.use('/auth', authRouter);

// Mount transaction routes
router.use('/transactions', transactionRouter);

// Mount receipt routes
router.use('/receipts', receiptRouter);

export default router;
