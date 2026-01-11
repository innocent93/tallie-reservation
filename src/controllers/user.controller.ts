import User from "../models/User";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction  } from "express";

/**
 * Register user
 */
export const register = async (req: Request, res: Response, next:NextFunction ) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Let Mongoose pre-save hook handle hashing
    const user = await User.create({
      email,
      password,
      role: role || "user"
    });

    res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response, next:NextFunction ) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 */
export const me = async (req: Request, res: Response, next:NextFunction ) => {
  res.json({
    id: req.user.id,
    role: req.user.role
  });
};


