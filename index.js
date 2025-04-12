import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/register", async (req, res) => {
  const { firstName, lastName, emailAddress, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = await client.user.create({
      data: {
        firstName,
        lastName,
        emailAddress,
        username,
        password: hashedPassword,
      },
    });
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
