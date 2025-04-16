export default function validateLogDetails(req, res, next) {
  console.log(req.body);
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Identifier and password are required." });
  }

  next();
}
