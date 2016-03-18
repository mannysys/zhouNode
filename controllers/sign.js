/**
 * 处理登录和注册功能
 */
var eventproxy = require('eventproxy');
var UserModel = require('../models/UserModel');
var crypto = require('crypto');

//显示注册页面
exports.showSignup = function(req, res){
    res.render('sign/signup');
};
//处理注册页面提交的信息
exports.signup = function(req, res){
    //获取用户提交的数据
    var username = req.body.loginname;
    var pass = req.body.pass;
    var re_pass = req.body.re_pass;
    var email = req.body.email;
    var ep = new eventproxy();
    //捕获到抛出事件的错误信息
    ep.on('info_error', function(msg){
        res.status(422);//返回给浏览器一个状态码
        res.render('sign/signup',{error: msg});
    });
    //校验数据
    //如果item数组中元素等于空了返回true
    var hasEmptyInfo=[username, pass, re_pass, email].some(function(item){
        return item === '';
    });
    //如果第一次输入密码和第二次输入的确认密码是不一样的则返回true
    var isPassDiff = pass !== re_pass;
    if(hasEmptyInfo || isPassDiff){
        //抛出一个错误事件
        ep.emit('info_error', '注册信息错误');
        return;
    }

    //保存到数据库
    //检查一下注册的用户名和邮箱是否在数据库中已经存在
    UserModel.getUserBySignupInfo(username, email, function(err, users){
        if(err){
            ep.emit('info_error', '获取用户数据失败！');
            return;
        }
        //如果查询出用户和邮箱数据长度就是大于0，表示有用户或者邮箱存在
        if(users.length > 0){
            ep.emit('info_error', '用户名或者邮箱被占用！');
            return;
        }
        //生成密码的md5值,密码加密
        var keypass = crypto.createHash('md5').update(pass).digest('hex');

        //将数据保存到数据库
        UserModel.addUser({username:username, pass:keypass, email:email},function(err,result){
            if(result){
                res.render('sign/signup', {success: '恭喜你，注册成功'});
            }else{
                ep.emit('info_error', '注册失败！');
            }
        });
    });

};

//显示登录页面
exports.showSignin = function(req, res){
    res.render('sign/signin');
};
//处理用户登录的提交信息
exports.signin = function(req, res){
    var username = req.body.name;
    var pass = req.body.pass;

    //校验数据
    if(!username || !pass){
        res.status(422);
        return res.render('sign/signin', {error: '您填写的信息不完整'});
    }
    //生成密码的md5值,密码加密
    var keypass = crypto.createHash('md5').update(pass).digest('hex');
    //从数据库查询用户
    UserModel.getUser(username, keypass, function(err, user){
        //如果用户查询到，则将用户保存到session中
        if(user){
            req.session.user = user;
            res.render('sign/signin', {success: '登陆成功'});
        }else{
            res.status(422);
            res.render('sign/signin', {error: '用户名或者密码错误！'});
        }

    });


};

//处理用户登出功能
exports.signout = function(req, res){
    req.session.destroy(); //清空一下session
    res.redirect('/'); //重定向到首页
};






















