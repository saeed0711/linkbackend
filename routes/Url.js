const express=require("express");
const route=express.Router()
const urlschema=require("../schema/urlschema")
const auth=require("../middleware/auth")
const shortid=require("shortid")
// find all link associated with the user

route.get("/find",auth, async(req,res)=>{
  console.log("fromfetching");
  let { page, limit } = req.query;
  const id=req.userid;
  console.log(id);
  page = parseInt(page) || 1; // Default page = 1
  limit = parseInt(limit) || 5; // Default limit = 5
  const skip = (page - 1) * limit;
const data=await urlschema.find({ userid:id}).skip(skip).limit(limit);
if(!data){
  return res.status(400).json({message:"ERRORE"})
}
 // Get total count (for frontend pagination controls)
 const totalUrl = await urlschema.countDocuments({userid:id});
//  console.log(totalUrl);
 const totalPages= Math.ceil(totalUrl / limit);
// console.log(totalPages);
   return res.status(200).json({data, totalPages,
   currentPage: page})

})


//to render
route.get("/find/:shorturl", async(req,res)=>{
   
  const short=req.params.shorturl;
  // console.log(short);
const data=await urlschema.findOne({short});
// console.log(data);
if(!data){
    return res.status(400).json({message:"ERRORE"})
}
   return res.redirect(data.url)

})


//to create short link

route.post("/create",auth,async(req,res)=>{

  const{url,summery,check,expdate}=req.body;
 const deviceinfo=req.headers["user-agent"]
 console.log(check);
 
 let device = "desktop";
 if (/mobile/i.test(deviceinfo)) {
  device = "mobile";
} else if (/tablet/i.test(deviceinfo)) {
  device = "tablet";
}

  //getting user id from token from auth
  try{
    const userid=req.userid;

// extracting host name from url 
  const host='https://linkbackend-gl1h.onrender.com/url/find'

  //console.log(host+" "+url+" "+summery+" "+expdate+" "+req.ip);

//generating shortalphnumric string 
  const short =shortid.generate()

  await urlschema.create({
      userid,
      ip:req.ip,
      url,
      short,
      shorturl:host+"/"+short,
      check,
      summery,
      expdate,
      devices:device 
   })

  console.log(host+"/"+short);
  return res.status(200).json({ message: "link created" });
  }catch(err){
    res.status(401).json({ message: "errore" });
  }

})

// to delete the url 
route.delete("/delete/:id",auth,async(req,res)=>{
    
    const _id=req.params.id;
    
    console.log("from acked delete");

    
    console.log(_id);
    const url=await urlschema.findById({_id})
    console.log(url);
    if(!url){
        return res.status(400).json({message:"url not found"})
    }
    const r1=await urlschema.deleteOne({_id});
    console.log(r1);
    res.status(200).json({message:"url deleted"})
})


module.exports=route
