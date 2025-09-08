/**
 * Authentication routes for handling user registration and login endpoints.
 *
 * This module defines the Express router for authentication-related routes,
 * mapping POST requests to the appropriate controller functions for user
 * registration and login.
 */

import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

export default router;
