import { PrismaClient } from '@prisma/client';
const client = new PrismaClient();

export const createBlog = async (req, res) => {
  const { title, excerpt, body } = req.body;

  try {
    const newBlog = await client.blogPost.create({
      data: {
        title,
        excerpt,
        body,
        featuredImage: "https://via.placeholder.com/600x400",
        author: {
          connect: { id: req.user.id },
        },
      },
    });

    res.status(201).json({
      message: "New blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ message: "Something went wrong creating blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await client.blogPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({blogs});
  } catch (error) {
    console.error("Get All Blogs Error:", error);
    res.status(500).json({ message: "Something went wrong fetching blogs" });
  }
};


export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await client.blogPost.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get My Blogs Error:", error);
    res.status(500).json({ message: "Something went wrong fetching your blogs" });
  }
};


export const getSingleBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await client.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Get Single Blog Error:", error);
    res.status(500).json({ message: "Something went wrong fetching the blog" });
  }
};


export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, body } = req.body;

  try {
    const blog = await client.blogPost.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    const updatedBlog = await client.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        body,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: "Something went wrong updating the blog" });
  }
};


export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await client.blogPost.findUnique({ where: { id } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await client.blogPost.delete({ where: { id } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Something went wrong deleting the blog" });
  }
};
