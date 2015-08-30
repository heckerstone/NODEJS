//取得一个集合中的所有数据并实现分页效果,这里我们还处理session的登录判断等
exports.index = function(req, res){
    var mongodb = require('mongodb');
    var page =1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var total; //分页的总数
    var pagenum =4; //分页的条数
    if(page){
        page = page;
    }else{
        page = 1;
    }

    mongodb.connect('mongodb://192.168.1.80:27017/mongodb',function(err,conn){
        conn.collection('user',function(err,coll){
            //这里是取得分页的总数(笔者最开始在这里的时候用的是coll.count()取总数,结果可想而知,所以取总数大家一定要注意)
            coll.count(function(err,count){
                total = count;
            })
            //这里用limit+skip实现mongodb的分页效果,这种写法对于大数据量的分页来说不合适,但是为了方便就这样了
            //下面是整个的过程,实现了分页实现一个集合中的所有数据
            //在nodejs连接mongodb的时候判断是否查询出了数据的时候我们用toArray方法获得的第二个参数来判断
            coll.find().limit(pagenum).skip(pagenum*(page-1)).toArray(function(err,results){
                if(results.length){
                    if(page==1){
                        var prevpage = page;
                    }else{
                        var prevpage = page-1;
                    }

                    if(page == Math.ceil(total/pagenum)){
                        var nextpage = Math.ceil(total/pagenum);
                    }else{

                        //这里要注意下,在对next的时候一定要对page加parseInt方法,不然他会按照字符串来相加,至于为什么,目前我也不清楚,但是只要加了parseInt就是正确的了
                        var nextpage = parseInt(page)+1;
                    }

                    //res.render('index',
                    //    {
                    //        title:'123',
                    //        username: req.session.username,
                    //        allIndexs:results,
                    //        prevpage:prevpage,
                    //        nextpage:nextpage
                    //        //page: "<a href='/"+prevpage+"'>prev</a>   <a href='/"+nextpage+"'>next</a>"
                    //    }
                    //);
                }else{
                    console.log('没有任何数据');
                }
                conn.close();  //每次执行完后都要把链接给关掉(注意关掉的位置,不能放在collection的时候就关闭,不然上面的数据永远取不到)
            })
        })
    });
};

//向一个集合中插入数据
exports.insert = function(req,res){
    var mongodb = require('mongodb');
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //这里的req.body.username是根据method数据发过来的方法获得的
            //使用mongodb插入数据的时候,我们可以在后面放一个回调方法来判断数据是否插入成功
            coll.insert({"username":req.body.username,"password":req.body.password},function(err,results){
                if(results.length){
                    res.redirect('/');
                }else{
                    res.redirect('/users');
                }
                conn.close();
            })
        })

    })
    console.log(req.body.username)
};

//登录方法,并且保存session,好在ejs中做判断是否登录成功
exports.login = function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var mongodb = require('mongodb');
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            coll.find({'username':username,'password':password}).toArray(function(err,results){
                if(results.length){
                    console.log('success');
                    req.session.username = username;
                    res.redirect('/');
                }else{
                    console.log('error');
                    res.redirect('/notlogin');
                }
                conn.close();
            })
        })
    })
};

//删除一个集合中的方法
exports.del = function(req,res){
    var mongodb = require('mongodb');
    var id = req.params.id;
    var mongoid = mongodb.BSONPure.ObjectID(id); //nodejs里面吧mongodb的id转化为ObjectID
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //这里的删除方法来判断数据成功与否,笔者试过了上面用toArray方法和直接在后面更回调函数的方法都不能判断,所以加了if判断
            //这里希望大家有什么好的实现方法说下,毕竟这种方法看起不怎么爽
            if(coll.remove({'_id':mongoid})){
                console.log('恭喜你删除成功');
                res.redirect('/')
            }else{
                console.log('删除失败');
                res.redirect('/')
            }
            conn.close();
        })
    })
}

//更新数据
exports.update = function(req,res){
    var mongodb = require('mongodb');
    var id = req.params.id;
    //nodejs里面吧mongodb的id转化为ObjectID
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //下面判断id是否存在,存在的话就显示更新的数据的模板,否则就更新代码
            if(id){
                var mongoid = mongodb.BSONPure.ObjectID(id);
                coll.find({'_id':mongoid}).toArray(function(err,results){
                    if(results.length){
                        console.log('success');
                        console.log(results);
                        res.render('update', { 'oneResult':results });
                    }else{
                        console.log('error');
                    }
                    conn.close();
                })
            }else{
                var username = req.body.username;
                var password = req.body.password;
                var mongoid = mongodb.BSONPure.ObjectID(req.body.id);
                //这里的更新也一样,不知道怎么做判断更新是否成功,所以干脆就这样写了
                coll.update({'_id':mongoid},{'$set':{'username':username,'password':password}});
                res.redirect('/');
                conn.close();
            }
        })
    })
}

//清空session
exports.logout = function(req,res){
    req.session.username='';  //清空session
    res.redirect('/');
}