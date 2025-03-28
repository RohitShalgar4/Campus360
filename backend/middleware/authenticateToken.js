import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie

  console.log("Token from cookie:", token); // Debugging: Log the token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Debugging: Log the error
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    console.log("Decoded token:", decoded); // Debugging: Log the decoded token

    // Set the user object in the request
    req.user = {
      id: decoded.id, // Use `id` from the token payload
      role: decoded.role, // Include role for role-based access control
    };

    // Add admin check helper
    req.isAdmin = () => {
      return req.user.role === 'admin';
    };

    next();
  });
};

// Admin middleware
export const isAdmin = (req, res, next) => {
  if (!req.isAdmin()) {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};