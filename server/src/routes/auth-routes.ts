import { Router, Request, Response } from "express";
import { User } from "../models/user"; // Import your User model
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// This is the login handler
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Make sure to type the result of `findOne` properly
    const user = await User.findOne({ where: { username } });

    // If no user found, return error
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { username: user.username, id: user.id }, // Payload for the JWT token
      process.env.JWT_SECRET as string, // Secret key for signing the token
      { expiresIn: "1h" }, // Token expiration
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const router = Router();

// POST /login - Login a user
router.post("/login", login);

export default router;
