//MongoDB连接
var mongo = require("mongodb");
var myModule=require("./common.js");
var host = "192.168.1.80";
var port= 27017;
var db = new mongo.Db("mongodb",new mongo.Server(host,port,{}));
var express=require("express");
var app=express.createServer();
app.use(app.router);
app.use(express.static(_dirname+"/public"));

db.open(function(error){
    console.log("we are connected!"+host+":"+port);
    db.collection("user",function(error,collection){
        console.log("we have the collection");
        //collection.insert({
        //    id:"1",
        //    name:"heckerstone",
        //    twitter:"heckerstone twitter",
        //    email:"heckerstone@163.com"
        //},function(){
        //    console.log("Successfully insert heckerstone");
        //});

        //collection.insert({
        //    id:"2",
        //    name:"heckerstone2",
        //    twitter:"heckerstone2 twitter",
        //    email:"heckerstone2@163.com"
        //},function(){
        //    console.log("Successfully insert heckerstone2");
        //});
    });
});

//删除
app.get("/user/:id",function(request,response){
    //获取url参数 request.params.id;
    var user=users[request.params.id];
    if(user){
        db.open(function(error){
            console.log("we are connected!"+host+":"+port);
            db.collection("user",function(error,collection){
                if(error){
                    console.log("delete failed");
                }else{
                    console.log("delete success");
                    collection.remove({'name':'heckerstone'});
                }
            });
        });
    }else{
        response.send("");
    }
});