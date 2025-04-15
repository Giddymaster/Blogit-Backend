import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import cookieParser from "cookie-parser";
import {PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import validateLogDetails from "./middleware/validateLogDetails.js";
import verifyUser from "./middleware/verifyUser.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
const client = new PrismaClient();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    // origin: "https://blogit-frontend-gilt.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);

app.post("/signup", async (req, res) => {
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

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, {});

    res.status(200).cookie("blogitAuthToken", token, {
      // httpOnly: true,
      // secure: true,
      // expires: 100000*60*24,
      // sameSite: "None",

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

app.post("/writeblog", verifyUser, async (req, res) => {
  try {
    const authorId = req.user.id;
    const { title, excerpt, body, featuredImage } = req.body;

    if(!authorId){
      return res.status(400).json({message: "Author Id is required"})
    }

    const newBlog = await client.blogPost.create({
      data: {
        title,
        excerpt,
        body,
        featuredImage,
        authorId,
      },
    });

    res.status(201).json({ message: "New Blog created successfully"});
  } catch (e) {
    res.status(500).json({ message: "Something went wrong creating blog"});
  }
});

app.put("/updateblog/:id", async (req, res) => {
const {id} = req.params;
const { title, excerpt, body, featuredImage} = req.body;
const userId = req.body.authorId;

  try {
    const blog = await client.post.findUnique({where: {id}
    });

    if(!blog) return res.status(404).json({message: "Blog Not Found"});

    if(!blog.authorId !== userId ) return res.status(403).json({message: "User not authorized to edit this blog"});

    const updated = await client.blogPost.update({
      where: {id},
      data: {title,excerpt,body, featuredImage},
    });
    
    res.status(200).json({message: "Blog updated successfully"})

  } catch (error) {
    res.status(500).json({ message: "Failed to update blogs" });
  }
});



const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
