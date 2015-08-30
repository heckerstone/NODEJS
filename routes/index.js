var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req,res,next){
  res.render('login',{title:'loginPage'});
});

router.get('/home',function(req,res,next){
  res.render('home',{title:'homePage'});
});

router.post('/checkLogin',function(req,res,next){
  var username=req.body.username;
  var password=req.body.password;
  var user={'username':username,'password':password};
  if(username=='heckerstone@163.com'&&password=='admin'){
    req.session.user=user;
    res.render('home',{title:'home'});
  }else{
    res.render('login',{title:username});
  }
});



module.exports = router;
