import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pfa';
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3600';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
export const MAX_UPLOAD_SIZE = process.env.MAX_UPLOAD_SIZE ? Number(process.env.MAX_UPLOAD_SIZE) : 10 * 1024 * 1024;
export const MINDEE_API_KEY = process.env.MINDEE_API_KEY || '';
