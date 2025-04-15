import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

export const createBlogs = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { title, excerpt, body, featuredImage } = req.body;
    if (!title || !excerpt || !body || !featuredImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = await client.blog.create({
      data: {
        title,
        excerpt,
        body,
        featuredImage,
        authorId
      },
    });

    res.status(201).json({ message: "Post created", postId: newPost.id });
  } catch (e) {
    console.error("Error creating blog:", e);
    res.status(500).json({ message: "Something went wrong creating blog" });
  }
};
