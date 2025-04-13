import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import validateLogDetails from "./middleware/validateLogDetails.js";

const app = express();
const client = new PrismaClient();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  }),
);

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
    res.status(201).json({ message: "New user created successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

app.post("/login", validateLogDetails, async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await client.user.findFirst({
      where: {
        OR :[
          { emailAddress: identifier },
          { username : identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email address or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email address or password" });
    }

    const jwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    res.status(200).cookie("blogitAuthToken", token, {
      // httpOnly: true,
      // secure: true,
      // expires: 100000*60*1
    }).json({
      message: "Login successful",
      token,
      user: jwtPayload,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!" });
  }
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
