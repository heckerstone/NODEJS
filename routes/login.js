var needLogin = function(path){
    var noLoginPath = ['/','/login','checkLogin']; //����Ҫ��½�ĵ�ַ

    for(var i =0; i< noLoginPath.length;i++)
    {
        var item = noLoginPath[i];
        if(path == item || (item + '/') == path){
            return false; //����Ҫ��½
        }
    }

    return true;
}
module.exports = needLogin;

