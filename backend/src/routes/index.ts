import { Router } from 'express';
import authRouter from './auth';
import transactionRouter from './transactions';

const router = Router();

// Mount authentication routes
router.use('/auth', authRouter);

// Mount transaction routes
router.use('/transactions', transactionRouter);

export default router;
