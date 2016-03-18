/**
 * Created by zhoujialin on 2016/3/18.
 */


//显示用户设置页面
exports.myset = function(req, res){
    var username = req.session.user.username;
    var email = req.session.user.email;
    res.render('user/myset',{username: username, email: email});
};




