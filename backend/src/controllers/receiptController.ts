/**
 * Receipt controller handling receipt upload and parsing.
 *
 * This module provides controller functions for uploading receipt files,
 * parsing them to extract transaction data, and returning the data without storing the receipt.
 */

import { Request, Response } from 'express';
import multer from 'multer';
import * as mindee from 'mindee';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { MINDEE_API_KEY } from '../config';

// Configure multer for file upload
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  },
});

/**
 * Extracts text or inference from uploaded file (PDF or image).
 *
 * @param file - The uploaded file buffer
 * @param mimeType - MIME type of the file
 * @returns Extracted text content or Mindee inference for PDFs
 */
async function extractText(file: Buffer, mimeType: string): Promise<string | any> {
  const apiKey = MINDEE_API_KEY;
  const modelId = "ffd2a5d9-1593-476e-a1cf-6560e519c0eb";

  // Create temp file with appropriate extension
  const tempDir = os.tmpdir();
  const extension = mimeType === 'application/pdf' ? 'pdf' : 'jpg';
  const tempFilePath = path.join(tempDir, `receipt_${Date.now()}.${extension}`);
  fs.writeFileSync(tempFilePath, file);

  try {
    // Init Mindee client
    const mindeeClient = new mindee.ClientV2({ apiKey: apiKey });

    // Set inference parameters
    const inferenceParams = {
      modelId: modelId,
      rag: false
    };

    // Load file from temp path
    const inputSource = new mindee.PathInput({ inputPath: tempFilePath });

    // Send for processing
    const response = await mindeeClient.enqueueAndGetInference(inputSource, inferenceParams);

    return response.inference.result.fields;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

/**
 * Parses Mindee inference to extract transaction data.
 *
 * @param inference - Mindee inference object
 * @returns Extracted transaction data
 */
function parseMindeeInference(fields: any): {
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
} {
  // Check if inference has the expected structure
  if (!fields) {
    throw new Error('Invalid inference structure - missing result.fields');
  }

  // Extract values from fields directly as Map keys
  const amount = fields.get("amount")?.value
  ? parseFloat(fields.get("amount").value)
  : 0;

const currency = "INR"; // Default to INR for receipts

const date = fields.get("date")?.value
  ? fields.get("date").value
  : new Date().toISOString().split("T")[0];

const description = fields.get("description")?.value
  ? fields.get("description").value
  : "Receipt";

const category = fields.get("purchase_category")?.value
  ? fields.get("purchase_category").value
  : "Other";

  return {
    type: 'expense', // Default to expense
    amount: amount,
    currency: currency,
    category: category,
    description: description,
    date: date,
  };
}

/**
 * Handles receipt file upload, parsing, and data extraction.
 *
 * Processes the uploaded file, extracts text, parses transaction data,
 * and returns the extracted data without storing the receipt.
 *
 * @param req - The Express request object containing the uploaded file
 * @param res - The Express response object
 * @returns A JSON response with extracted transaction data
 */
export const uploadReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file as Express.Multer.File;
    const mimeType = file.mimetype;

    // Extract text or inference from the file
    const extracted = await extractText(file.buffer, mimeType);

    // Parse Mindee inference for both PDF and images
    const transactionData = parseMindeeInference(extracted);

    // Return the extracted transaction data
    const response = {
      success: true,
      transactionData,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process receipt',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export multer middleware for use in routes
export const uploadMiddleware = upload.single('receipt');
