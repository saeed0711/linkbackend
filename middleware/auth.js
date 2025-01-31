const jwt = require("jsonwebtoken");

 function auth (req,res,next){
//   const token=req.cookies.token;
  const token = req.headers.authorization;
  // console.log(req.cookies);
  
  if(!token){  return res.status(401).json({ message: "This action is not allowed" });}
  try{
    const decoded= jwt.verify(token,"secret")
    req.userid=decoded.id
    console.log(decoded.id +"from auth");
    next()
}catch(err){
    res.status(401).json({ message: "Invalid token" });
}
}
module.exports = auth