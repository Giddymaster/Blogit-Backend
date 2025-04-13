export default function validateLogDetails(req, res, next) {
  console.log(req.body);
  const { emailAddress, password } = req.body;

  if (!emailAddress || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  next();
}
