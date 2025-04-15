import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import authRouter from './routes/auth.routes.js'
import blogsRouter from './routes/blogposts.routes.js'


dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    // origin: "https://blogit-frontend-gilt.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);


app.use("/auth", authRouter);
app.use('/blogpost', blogsRouter)


app.use("/uploads", express.static(path.join("uploads")));

const uploadDir = path.join("uploads", "featuredImages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });


app.post("/posts", upload.single("image"), async (req, res) => {
  const { title, excerpt, body } = req.body;

  if (!title || !excerpt || !body || !req.file) {
    return res.status(400).json({ message: "All fields including image are required." });
  }

  try {
    const newPost = await client.post.create({
      data: {
        title,
        excerpt,
        body,
        featuredImage: `/uploads/featuredImages/${req.file.filename}`,
      },
    });

    res.status(201).json({ message: "Post created", postId: newPost.id });
  } catch (error) {
    console.error("Failed to create post:", error);
    res.status(500).json({ message: "Server error" });
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
