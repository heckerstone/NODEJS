//ȡ��һ�������е��������ݲ�ʵ�ַ�ҳЧ��,�������ǻ�����session�ĵ�¼�жϵ�
exports.index = function(req, res){
    var mongodb = require('mongodb');
    var page =1;  //ȡ��page��ֵ,ע��route�е�����,�����п���û�����page
    var total; //��ҳ������
    var pagenum =4; //��ҳ������
    if(page){
        page = page;
    }else{
        page = 1;
    }

    mongodb.connect('mongodb://192.168.1.80:27017/mongodb',function(err,conn){
        conn.collection('user',function(err,coll){
            //������ȡ�÷�ҳ������(�����ʼ�������ʱ���õ���coll.count()ȡ����,��������֪,����ȡ�������һ��Ҫע��)
            coll.count(function(err,count){
                total = count;
            })
            //������limit+skipʵ��mongodb�ķ�ҳЧ��,����д�����ڴ��������ķ�ҳ��˵������,����Ϊ�˷����������
            //�����������Ĺ���,ʵ���˷�ҳʵ��һ�������е���������
            //��nodejs����mongodb��ʱ���ж��Ƿ��ѯ�������ݵ�ʱ��������toArray������õĵڶ����������ж�
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

                        //����Ҫע����,�ڶ�next��ʱ��һ��Ҫ��page��parseInt����,��Ȼ���ᰴ���ַ��������,����Ϊʲô,Ŀǰ��Ҳ�����,����ֻҪ����parseInt������ȷ����
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
                    console.log('û���κ�����');
                }
                conn.close();  //ÿ��ִ�����Ҫ�����Ӹ��ص�(ע��ص���λ��,���ܷ���collection��ʱ��͹ر�,��Ȼ�����������Զȡ����)
            })
        })
    });
};

//��һ�������в�������
exports.insert = function(req,res){
    var mongodb = require('mongodb');
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //�����req.body.username�Ǹ���method���ݷ������ķ�����õ�
            //ʹ��mongodb�������ݵ�ʱ��,���ǿ����ں����һ���ص��������ж������Ƿ����ɹ�
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

//��¼����,���ұ���session,����ejs�����ж��Ƿ��¼�ɹ�
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

//ɾ��һ�������еķ���
exports.del = function(req,res){
    var mongodb = require('mongodb');
    var id = req.params.id;
    var mongoid = mongodb.BSONPure.ObjectID(id); //nodejs�����mongodb��idת��ΪObjectID
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //�����ɾ���������ж����ݳɹ����,�����Թ���������toArray������ֱ���ں�����ص������ķ����������ж�,���Լ���if�ж�
            //����ϣ�������ʲô�õ�ʵ�ַ���˵��,�Ͼ����ַ���������ôˬ
            if(coll.remove({'_id':mongoid})){
                console.log('��ϲ��ɾ���ɹ�');
                res.redirect('/')
            }else{
                console.log('ɾ��ʧ��');
                res.redirect('/')
            }
            conn.close();
        })
    })
}

//��������
exports.update = function(req,res){
    var mongodb = require('mongodb');
    var id = req.params.id;
    //nodejs�����mongodb��idת��ΪObjectID
    mongodb.connect('mongodb://localhost:27017/test',function(err,conn){
        conn.collection('test_insert',function(err,coll){
            //�����ж�id�Ƿ����,���ڵĻ�����ʾ���µ����ݵ�ģ��,����͸��´���
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
                //����ĸ���Ҳһ��,��֪����ô���жϸ����Ƿ�ɹ�,���Ըɴ������д��
                coll.update({'_id':mongoid},{'$set':{'username':username,'password':password}});
                res.redirect('/');
                conn.close();
            }
        })
    })
}

//���session
exports.logout = function(req,res){
    req.session.username='';  //���session
    res.redirect('/');
}