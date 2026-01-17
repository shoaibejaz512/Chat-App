import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // ✅ USE id
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};