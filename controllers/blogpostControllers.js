export  const createBlogs = (req, res) =>{
    try{
        const {title, excerpt, blog, featuredImage} = res.body;
    }catch(e){

        res.status(500).json({message: "Something went wrong creating blog"})

    }
}