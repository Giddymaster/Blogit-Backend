import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blogposts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: "https://blogit-frontend-gilt.vercel.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));