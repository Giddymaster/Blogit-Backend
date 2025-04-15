import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from './routes/auth.routes.js'
import blogsRouter from './routes/blogposts.routes.js'


dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    // origin: "*",
    origin: "https://blogit-frontend-gilt.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  }),
);


app.use("/auth", authRouter);
app.use('/blogpost', blogsRouter)

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
