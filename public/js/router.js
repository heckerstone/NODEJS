var express=require('express');
var fs=require('fs');

var app=express();

app.use("/user/:id",function(request,response){
    response.send("获取到的编号为:"+request.params.id);
});

app.listen(3002);//监听3002端口