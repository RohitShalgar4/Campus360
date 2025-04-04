import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    let token = req.headers.authorization?.split(" ")[1];

    // If no token in header, try to get from cookies
    if (!token) {
      token = req.cookies.token;
    }

    console.log("Token from header or cookie:", token); // Debug log

    if (!token) {
      return res.status(401).json({ message: "Authentication token is missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded); // Debug log

    // Set user info in request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    // Add admin check helper
    req.isAdmin = () => {
      return req.user.role === 'admin';
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};