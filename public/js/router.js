var express=require('express');
var fs=require('fs');

var app=express();

app.use("/user/:id",function(request,response){
    response.send("��ȡ���ı��Ϊ:"+request.params.id);
});

app.listen(3002);//����3002�˿�