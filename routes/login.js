var needLogin = function(path){
    var noLoginPath = ['/','/login','checkLogin']; //不需要登陆的地址

    for(var i =0; i< noLoginPath.length;i++)
    {
        var item = noLoginPath[i];
        if(path == item || (item + '/') == path){
            return false; //不需要登陆
        }
    }

    return true;
}
module.exports = needLogin;

