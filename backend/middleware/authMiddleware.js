const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(400)
        .json({ message: "Authorization token not found, please login." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          message: "Token is invalid or expired. Please log in again.",
        });
      }

      req.userId = decoded._id; // Store user ID in the request
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", data: [] });
  }
}

module.exports = authMiddleware;
