/**
 * 处理登录和注册功能
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var UserModel = require('../models/UserModel');
var tools = require('../common/tools');
var config = require('../config');

//显示注册页面
exports.showSignup = function(req, res){
    res.render('sign/signup');
};
//处理注册页面提交的信息
exports.signup = function(req, res){
    //获取用户提交的数据
    var username = validator.trim(req.body.loginname);
    var pass = validator.trim(req.body.pass);
    var re_pass = validator.trim(req.body.re_pass);
    var email = validator.trim(req.body.email);
    var ep = new eventproxy();
    //捕获到抛出事件的错误信息
    ep.on('info_error', function(msg){
        res.status(422);//返回给浏览器一个状态码
        res.render('sign/signup',{error: msg});
    });

    // 验证注册信息正确性
    var hasEmptyInfo=[username, pass, re_pass, email].some(function(item){
        return item === ''; //如果item数组中元素等于空了返回true
    });
    var isPassDiff = pass !== re_pass; //检测第一次密码和第二次密码是不一样的则返回true
    if(hasEmptyInfo || isPassDiff){
        return ep.emit('info_error', '注册信息不能为空或两次密码输入不一致');//抛出一个错误事件
    }
    if (username.length < 5 || username.length > 15) {
        return ep.emit('info_error', '请输入用户名5到15个字符');
    }
    if (!tools.validateId(username)) {
        return ep.emit('info_error', '用户名不合法。');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('info_error', '邮箱不合法。');
    }
    // END 验证信息的正确性

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
        var keypass = tools.encrypt(pass);//密码加密
        var default_avatar = config.default_avatar;
        var random_num = Math.floor((Math.random()*default_avatar.length));

        //将数据保存到数据库
        UserModel.addUser({
            username:username,
            pass:keypass,
            email:email,
            avatar:default_avatar[random_num]
        },function(err,result){
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
    var username = validator.trim(req.body.name);
    var pass = validator.trim(req.body.pass);
    //校验数据
    if(!username || !pass){
        res.status(422);
        return res.render('sign/signin', {error: '您填写的信息不完整'});
    }
    //密码加密
    var keypass = tools.encrypt(pass);
    //从数据库查询用户
    UserModel.getUser(username, keypass, function(err, user){
        //如果用户查询到，则将用户保存到session中
        if(user){
            req.session.user = user;
            res.redirect('/'); //跳转到首页
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

//关于页面
exports.showAbout = function(req, res){
    res.render('sign/about');
};



















