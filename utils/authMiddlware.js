import jwt from 'jsonwebtoken'
import secretKey from '../jwtconfig.js'

function authanticateToken(req,res,next){
    const authHeader=req.header('Authorization')
    if(!authHeader) {
        res.status(401).json({'message':"Authrozation is missing"})
    }
    const [bearer,token]=authHeader.split(" ")

    if(bearer != "Bearer" || !token) {
        res.status(401).json({'message':"invalid token format"})
    }
    jwt.verify(token,secretKey,(error,user)=>{
        if(error) {
            res.status(403).json({'message':"invalid token"})
        }
        req.user=user
        next()
    })
}
export default authanticateToken;