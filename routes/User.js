
const express=require("express")
const route=express.Router()
const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
const User=require("../schema/userschema")
const auth=require("../middleware/auth")
const bcrypt=require("bcrypt")
// const { json } = require("body-parser")

dotenv.config()


route.get("/find",async (req,res)=>{
    // const {name,email,password}=req.body
   
    const u=await User.find();
    console.log(req.ip);
    console.log(req.headers.host)
    // console.log(res.headers.Date)  
    let ua=req.headers["user-agent"]
    console.log(ua);

   if(!u){return  res.status(500).json({message:"errore"})}
    
    res.json(u) 
   

})

route.get("/find/:email",async (req,res)=>{
    const email=req.params.email;
    console.log(email+"hi");
    const std=await User.findOne({email:email});
    console.log(std);
    if(!std){return res.status(404).json({message:"bad reuest"})}
    res.json(std)
})
  

route.post("/register",async (req,res)=>{
console.log(req.body);
    const {name,email,password,mobile}=req.body
    console.log(name +email+password);
    const temp=await User.findOne({email})
    if(temp){
       return res.status(404).json({message:"user alredy existed please login"})
    }
   const hashpass=await bcrypt.hash(password,10);
   try{
    
   await User.create({  
    name,
    email,
    password: hashpass,
    mobile
   })
  return res.status(200).json({ message: "User created" });

   }catch(error){
    return res.status(400).json(error.message);
   }



})

route.post("/login",async(req,res)=>{
    const {email,password}=req.body
    console.log(password);  
    console.log(email);
    const user= await User.findOne({email})
    console.log(user);
    if(!user){
        return res.status(400).json({message:"please enter right credentials"})
    }
    const verify=await bcrypt.compare(password,user.password)
    console.log(verify);
    if(!verify){
        return res.status(400).json({message:"please enter right credentials"})
    }
    const token=await jwt.sign({id:user._id},"secret",{expiresIn:"4h"})
    
    
    // res.cookie("token",token)  
    console.log("sent");
    return res.status(200).json({message:"logged in",token:token,user:user})
})  

  
route.delete("/delete",auth,async(req,res)=>{
    console.log("in delete");
   try{
    const id=req.userid;
    console.log(id);
    const std=await User.findById({_id:id});
    console.log(std);
    if(!std){return res.status(404).json({message:"bad reuest"})}
     await User.deleteOne(std)
    res.status(200).json({message:"user deleted"})
   }catch(err){
    res.status(401).json({err})
   }
})


module.exports=route
