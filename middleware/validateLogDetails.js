export default function validateLogDetails(req, res, next) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    if (username !== "string" || password !== "string") {
      return res.status(400).json({ message: "Invalid input types." });
    }
  
    next();
  }
  