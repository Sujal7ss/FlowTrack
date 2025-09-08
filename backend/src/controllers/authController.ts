/**
 * Authentication controller handling user registration and login operations.
 *
 * This module provides controller functions for managing user authentication,
 * including registering new users with hashed passwords and logging in existing
 * users by verifying credentials and issuing JWT tokens.
 */

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";

/**
 * Handles user registration.
 *
 * Validates input data, checks for existing users, hashes the password,
 * creates a new user in the database, and returns the user details.
 *
 * @param req - The Express request object containing user data in the body.
 * @param res - The Express response object.
 * @returns A JSON response with user details on success or an error message.
 */
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const existing = await User.findOne({ email });

  if (existing) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });

  res.status(201).json({ id: user._id, email: user.email, name: user.name });
};

/**
 * Handles user login.
 *
 * Validates input data, retrieves the user, verifies the password,
 * generates a JWT token, and returns it along with expiration info.
 *
 * @param req - The Express request object containing login credentials in the body.
 * @param res - The Express response object.
 * @returns A JSON response with access token on success or an error message.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = (jwt.sign as any)({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({ accessToken: token, expiresIn: JWT_EXPIRES_IN });
};
