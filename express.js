var fs=require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var express=require("express");
var app=express.createServer();

app.use(app.router);
app.use(express.static(_dirname+"/public"));

app.get("/",function(request,response){
    response.send("Hello!");
});

app.get("/hello/:text",function(request,response){
    response.send("Hello"+ request.params.text);
});

var users={
    "1":{
        "name":"Jeffrey Way",
        "twitter":"Jeffrey Way"
    },"2":{
        "name":"Jeffrey Way2",
        "twitter":"Jeffrey Way2"
    }
};

app.get("/user/:id",function(request,response){
    //获取url参数 request.params.id;
    var user=users[request.params.id];
    if(user){
        response.send("<a href='http://twitter.com" +user.twitter+"'>Follow"+user.name+"on twitter </a>");
    }else{
        response.send("");
    }
});

app.listen(port,host);



/***
 * express post案例
 **/
var http = require('http'),
url = require('url'),
fs = require('fs'),
qs = require('querystring'),
server;
server = http.createServer(function (req,res) {
    var urlData, encode = "utf8",filePath = "view/express_post_example_form.html",formData,action;
    urlData = url.parse(req.url,true);
    action = urlData.pathname;
    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
if (action === "/Signup") {
    formData = '';
    req.on("data",function(data){
        formData += data;
    });
    req.on("end", function () {
        user = qs.parse(formData);

    });
}else {
    fs.readFile(filePath, encode, function(err, file) {
        res.write(file);
        res.end();
    });
}
});
server.listen(3000);
console.log('Server running:' + new Date());