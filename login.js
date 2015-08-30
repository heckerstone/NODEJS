var express = require('express');
var path = require('path');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));


app.post("/login/checkLogin",function(request,response){
    var username=request.body.username;
    var password=request.body.password;
    if(username=="heckerstone@163.com"&&password=="admin"){
        response.send("µÇÂ½³É¹¦");
    }else{
        response.send("µÇÂ½Ê§°Ü");
    }
});

app.listen(3005);