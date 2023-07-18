const jwt = require("jsonwebtoken");

// Middleware function to authenticate the user
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.header("x-auth-token");

  // Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;
