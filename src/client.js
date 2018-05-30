var request = require('request');
var fs = require('fs');
var myConst = require('./const')


const url_base = 'http://103.72.164.2:'+myConst.port.toString()
const url_api=myConst.API_URL
const api={
   
    product:{
        add:url_base+url_api.product.add,
        del:url_base+url_api.product.del,
        update:url_base+url_api.product.update,
        get:url_base+url_api.product.get,
    },
    user:{
        register:url_base+url_api.user.register,
        login:url_base+url_api.user.login,
        logout:url_base+url_api.user.logout
    },
    picture:{
        add:url_base+url_api.picture.add,
        del:url_base+url_api.picture.del,
        get:url_base+url_api.picture.get,
        getThumbnail:url_base+url_api.picture.getThumbnail
    }
}


var postJson = (url, param, token, callback) => {
    request.post({
        url: url,
        json: true,
        headers: {
            "content-type": "application/json",
            'token':token
        },
        body: param
    }, (error, response, body) => {
        error?callback(600,error):callback(response.statusCode,body)            
    }) 
}

var user={
    register:'',
    login:(name,pw, callback)=>{
        var param = {
            user:name,
            password:pw,
        }
        postJson(api.user.login, param,{},callback)
    },
    logout:'',
}

var product={
    add: (newproduct, token,callback) => {
        var param = {
            newproduct: newproduct
        }
        postJson(api.product.add, param, token,callback)
    },
    del:(id, token,callback) => {
        var param = {
            productId: id
        }
        postJson(api.product.del, param, token,callback)
    },
    update:(id,update, token,callback)=>{       
        var param = {
            productId:id,
            update:update
        }
        postJson(api.product.update, param, token,callback)
    },
    get:(condition,token, callback)=>{
        var param={
            condition:condition
        }
        postJson(api.product.get, param, token,callback)
    }
    
}

var picture={
    add:(productId,file, token,callback) => {
        var formData = {
            file: fs.createReadStream(file),        
        };
        var xx=fs.createReadStream(file)
        console.log(xx)
        request.post({
            url: api.picture.add,
            formData: formData,
            headers: {
                'token':token,
                'productId':productId,
            },
        }, (error, response, body) => {
            if(error)
                callback(600,error)
            else
                callback(response.statusCode,body)
        })
    },
    del:(productId,pictureId,token, callback) => {
        var param = {
            productId:productId,
            pictureId: pictureId
        }
        postJson(api.picture.del, param,token, callback)
    },
    get:(productId,pictureId,token,callback)=>{
        var param = {
            productId:productId,
            pictureId: pictureId
        }
        postJson(api.picture.get, param,token,callback)
    }
}




var myCallback=(code,body)=>{
        console.log(code)
        console.log(body)
}
// task.add(newtask,myCallback)
// task.get({},myCallback)

var newproduct={
    name:'交换机',
    description:'这是一种很非常SB的交换机',
    price:'1200',
    pics:[]
}
var visitServer=async () => {
    var token = await new Promise((resolve, reject) => {
        user.login('xia','123',(code,body)=>{
            resolve(body)
        })
    });
    // product.add(newproduct,token,myCallback)
    // picture.add('5ab06a969ebfcc0c88269a6d','11.jpg',token,myCallback)
    // picture.del('5ab06a969ebfcc0c88269a6d','a448e837417732280adff84f6544e8b5',token,myCallback)

    // picture.del('5aaf99921bbc1312c006bea6','0f54aa3204d88756eaf206dd37b14f7e',token,myCallback)
    product.get({},token,myCallback)
    // product.del('5ab06a969ebfcc0c88269a6d',token,myCallback)
}
// visitServer()
// picture.add('11.jpg',myCallback)
// picture.get(myCallback)

var type='111'
console.log({type})

function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
}
function timeago(dateTimeStamp){   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();   //获取当前时间毫秒
    console.log(now)
    var diffValue = now - dateTimeStamp;//时间差
 
    if(diffValue < 0){
        return;
    }
    var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
    var hourC = diffValue/hour;
    var dayC = diffValue/day;
    var weekC = diffValue/week;
    var monthC = diffValue/month;
    if(monthC >= 1 && monthC <= 11){
        result = " " + parseInt(monthC) + "月前"
    }else if(weekC >= 1 && weekC <= 3){
        result = " " + parseInt(weekC) + "周前"
    }else if(dayC >= 1 && dayC <= 6){
        result = " " + parseInt(dayC) + "天前"
    }else if(hourC >= 1 && hourC <= 23){
        result = " " + parseInt(hourC) + "小时前"
    }else if(minC >= 1 && minC <= 59){
        result =" " + parseInt(minC) + "分钟前"
    }else if(diffValue >= 0 && diffValue <= minute){
        result = "刚刚"
    }else {
        var datetime = new Date();
        datetime.setTime(dateTimeStamp);
        var Nyear = datetime.getFullYear();
        var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        result = Nyear + "-" + Nmonth + "-" + Ndate
    }
    return result;
}


