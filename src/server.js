var express = require('express')
var fs = require('fs')
var bodypaser = require('body-parser')
var jwt=require('jwt-simple')
var multer = require('multer')
var path = require('path')
var dbo = require('./serverdbo')
var api = require('./const').API_URL
var port=require('./const').port
const uploadDir='../upload/'
const picDir='../picture/'


var app = express()
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "token,content-type,productId");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use(bodypaser.json({limit: '50mb'}));
app.use(bodypaser.urlencoded({limit: '50mb', extended: true}));


var upload = multer({
  dest: uploadDir
}) 


var accessLog=(api,comingIp)=>{
  console.log(api + ' has been accessed by %s at %s',comingIp,Date.now())
}

var verifyToken=(token)=>{
  try{
    var decoded=jwt.decode(token,'secrettt')    
  }
  catch (e){
    console.log('token wrong!')
    return false
  }
  return true
}

//user.login
app.post(api.user.login,(req,res)=>{
  accessLog(api.user.login, req.ip)
  var user=req.body.user
  var pw=req.body.password
  if(user==null||pw==null)
    return res.sendStatus(415)
  if (user=='xia'&&pw=='123'){
    var token = jwt.encode({user:'xia'}, 'secrettt');
    res.send(token)
  }
  else
    return res.sendStatus(401)
})

//product.add
app.post(api.product.add, (req, res) => {
  accessLog(api.product.add, req.ip)
  var token=req.get('token')
  if(!verifyToken(token))
    return res.sendStatus(401)
  var newproduct = req.body.newproduct
  if (newproduct == null)
    return res.sendStatus(415)
  //todo: verify validity of newproduct to the server 
  var decoded=jwt.decode(token,'secrettt') 
  newproduct.user=decoded.user
  newproduct.pubTime=Date.now()
  console.log(newproduct.pubTime)
  newproduct.expireTime=parseInt(newproduct.pubTime)+parseInt(newproduct.expireTime)
  console.log(newproduct.expireTime)
  dbo.product.add(newproduct, (err,id) => {
    err ? res.sendStatus(500) : res.send(id)
  })
})

//product.delete
app.post(api.product.del, (req, res) => {
  accessLog(api.product.del, req.ip)
  var token=req.get('token')
  if(!verifyToken(token))
    return res.sendStatus(401)
  var id = req.body.productId
  if (id == null) 
    return res.sendStatus(415)
  try{
    var delpath=picDir+id
    var files = fs.readdirSync(delpath);
    files.forEach((file,index)=>{
      fs.unlinkSync(delpath+'/'+file)
    })
    fs.rmdirSync(delpath)
  }
  catch(e){console.log(e)}
  dbo.product.del(id, (err) => {
    err ? res.sendStatus(500) : res.sendStatus(200)
  })
})

//product.update
app.post(api.product.update, (req, res) => {
  accessLog(api.product.update, req.ip)
  var token=req.get('token')
  if(!verifyToken(token))
    return res.sendStatus(401)
  var id =req.body.productId
  var update=req.body.update
  if(id==null||update==null)
    return res.sendStatus(415)
  dbo.product.update(id,update,(err)=>{
    err ? res.sendStatus(500) : res.sendStatus(200)
  })
})


//product.get
app.post(api.product.get, (req, res) => {
  accessLog(api.product.get, req.ip)
  var token=req.get('token')
  if(!verifyToken(token))
    return res.sendStatus(401)
  var condition = req.body.condition
  if (condition == null)
    condition={}
    
  dbo.product.get(condition,(err,result)=>{
    if(err)
      res.sendStatus(500)
    else{
      result.map((v)=>{
        v.pics=v.pics[0]
      })
      
      res.json(result)
    }
  })
})

//product.getPics
app.post(api.product.getPics, (req, res) => {
  accessLog(api.product.getPics, req.ip)
  var token=req.get('token')
  if(!verifyToken(token))
    return res.sendStatus(401)
  var productId = req.body.productId
  if (productId == null)
    return res.sendStatus(415)
    
  dbo.product.getOne(productId,(err,result)=>{
    if(err)
      res.sendStatus(500)
    else{
      res.json(result[0].pics)
    }
  })
})




// //picture.add
// app.post(api.picture.add, upload.single('file'), (req, res) => {
//   accessLog(api.picture.add, req.ip)
//   var token=req.get('token')
//   if(!verifyToken(token))
//     return res.sendStatus(401)
//   var productId = req.get('productId')
//     if (productId == null) 
//       return res.sendStatus(415)
//   var file = req.file
//   console.log(file)
//   try{
//     if(!fs.existsSync(picDir+productId))
//       fs.mkdirSync(picDir+productId)
//     fs.renameSync(uploadDir + file.filename, picDir+productId+"/" +file.filename)
//   }
//   catch(e){
//     console.log(e)
//     return res.sendStatus(500)
//   }
//   dbo.product.addPic(productId,file.filename,(err)=>{
//     err ? res.sendStatus(500) : res.sendStatus(200)
//   })
  
// })
// //picture.del

// app.post(api.picture.del, (req, res) => {
//   accessLog(api.picture.del, req.ip)
//   var token=req.get('token')
//   if(!verifyToken(token))
//     return res.sendStatus(401)
//   var pictureId=req.body.pictureId
//   var productId=req.body.productId
//   if(pictureId==null||productId==null)
//     return res.sendStatus(415)
//   var delpic=async () => {
//     await new Promise((resolve, reject) => {
//       dbo.product.delPic(productId,pictureId,(err,rest)=>{
//           err?res.sendStatus(500):resolve(true)
//       })
//     })
//     try{
//       fs.unlinkSync(picDir+productId+"/" +pictureId)
//     }
//     catch(e){
//       return res.sendStatus(500)
//     }
//     res.sendStatus(200)
//   }
//   delpic()
// })




// //picture.get
// app.post(api.picture.get,(req, res) => {
//   accessLog(api.picture.get, req.ip)
//   var pictureId=req.body.pictureId
//   var productId=req.body.productId
//   if(pictureId==null||productId==null)
//     return res.sendStatus(415)
//   console.log(pictureId)
//   let content
//   try{
//     content=fs.readFileSync(picDir+'/'+productId+'/'+pictureId ,"binary")
//   }
//   catch(e){
//     return res.sendStatus(500)
//   }
//   res.setHeader("Content-Type", 'jpg');
//   res.writeHead(200, "Ok");
//   res.write(content,"binary"); //格式必须为 binary，否则会出错
//   res.end();
// })


//start server at localhost on the designated port
var server = app.listen(port, function () {
  // var host = server.address().address
  // var port = server.address().port
  dbo.connect("mongodb://localhost:27017", 'info', (err) => {
    err ? console.log('db connection fail!') : console.log('server starts!')
  })

})