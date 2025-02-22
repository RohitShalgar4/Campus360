import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("Token from cookies:", token); // Log the token

    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decode); // Log the decoded token

    if (!decode) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error); // Log the error
    return res.status(500).json({ message: "Server error during authentication" });
  }
};