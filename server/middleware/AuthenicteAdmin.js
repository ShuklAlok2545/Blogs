import jwt, { decode } from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
export const authentication = (req,res,next)=>{
    const header =  req.headers["authorization"];
    console.log(`header ${header}`)
    if(!header) res.status(403).json({message:'no token provided'});
    const token = header.split(" ")[1];
    console.log('tokens',token);

   jwt.verify({token},JWT_SECRET,(err,decoded)=>{
        if(err) res.status(401).json({message:'unautorized'});
        res.user = decoded;
        next();
   })
}