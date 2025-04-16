import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validateLogDetails from "../middleware/validateLogDetails.js";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const signup = async (req, res) => {
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
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await client.user.findFirst({
      where: {
        OR: [{ emailAddress: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email address or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email address or password" });
    }

    const jwtPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, {});

    res
      .status(200)
      .cookie("blogitAuthToken", token, {
        // httpOnly: true,
        // secure: true,
        // expires: 100000*60*24,
        // sameSite: "None",
      })
      .json({
        message: "Login successful",
        token,
        user: jwtPayload,
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
