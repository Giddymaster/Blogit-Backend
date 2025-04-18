import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();



export const signup = async (req, res) => {
  const { firstName, lastName, emailAddress, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await client.user.create({
      data: { firstName, lastName, emailAddress, username, password: hashedPassword },
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
      where: { OR: [{ emailAddress: identifier }, { username: identifier }] },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email address or password" });
    }

    const jwtPayload = { id: user.id, firstName: user.firstName, lastName: user.lastName };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY);

    res.status(200)
      .cookie("blogitAuthToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({ message: "Login successful", token, user: jwtPayload });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};
