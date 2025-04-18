import jwt from "jsonwebtoken";

export default function verifyUser(req, res, next) {
  const { blogitAuthToken } = req.cookies;

  if (!blogitAuthToken) {
    console.error("Authorization token missing");
    return res.status(401).json({ message: "Authorization token is missing. Please log in." });
  }

  jwt.verify(blogitAuthToken, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }

    console.log("Token verified, user:", data);
    req.user = data;
    next();
  });
}
