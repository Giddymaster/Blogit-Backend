import jwt from 'jsonwebtoken';

export default function verifyUser(req, res, next){
    const{blogitAuthToken} = req.cookies

    if (!blogitAuthToken){
        return res.status(401).json({message: "not authorized, login"})
    }

    jwt.verify(blogitAuthToken, process.env.JWT_SECRET_KEY, (err, data)=>{
        if (err) {
            return res.status(401).json({message: "Not authorized, Login"})
        }else{
            req.user = data;
            next();
        }
    })

}