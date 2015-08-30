var DB = require('./DB.js').DB;
var log4j=require('log4js');
var logger=log4j.getLogger();
/**
 * @description MongoDB基本增、删、改、查操作封装
 * @autor heckerstone
 * @date 2015-08-26 14:18:00
 */
/**
 * @description Mongodb添加操作
 * @param formData   封装的表单json数据 注意:[formData 是序列化后的数据]
 * @param docName    mongodb-->表名(Mongodb中的表相当于一个Document)
 * @return true 添加成功 false 添加失败
 */
function add(formData,docName){
    DB(docName, function (db, collection) {
      //得到collection就可以直接操作mongodb
        collection.insert(formData,function(error,result){
            if(error){
                logger.ERROR(error);
                return false;
            }else{
                return true;
            }
        });
    });
}

//删除
function del(){

}

//修改
function edit(){

}

//查询
function query(){

}

//分页查询
function queryByPage(){

}

module.exports.add=add;
module.exports.del=del;
module.exports.edit=edit;
module.exports.query;
module.exports.queryByPage=queryByPage;