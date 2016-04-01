/**
 * Created by zhoujialin on 2016/3/18.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var UserModel = require('../models/UserModel');
var tools = require('../common/tools');

//显示用户设置页面
exports.myset = function(req, res){
    var username = req.session.user.username;
    var email = req.session.user.email;
    res.render('user/myset',{current_user: req.session.user});
};

exports.setting = function(req, res){
    var current_user=req.session.user;
    var ep = new eventproxy();
    var action = req.body.action;
    //捕获到抛出事件的错误信息
    ep.on('info_error', function(msg){
        res.status(422);//返回给浏览器一个状态码
        res.render('user/myset',{error: msg, current_user: current_user});
    });

    //保存用户设置信息
    if(action === 'change_setting'){
        var location = validator.trim(req.body.location);
        var weibo = validator.trim(req.body.weibo);
        var signature = validator.trim(req.body.signature);

        UserModel.getUserById(current_user._id, function(err, user){
            user.location = location;
            user.weibo = weibo;
            user.signature = signature;
            user.update_at = Date.now();
            user.save(function(err){
                if(err){
                    return ep.emit('info_error', '保存设置失败');
                }
                req.session.user = user.toObject({virtual: true}); //更新session
                res.render('user/myset',{success: '保存设置成功', current_user: current_user});
            });

        });
    }
    //修改用户密码
    if(action === 'change_password'){
        var old_pass = validator.trim(req.body.old_pass);
        var new_pass = validator.trim(req.body.new_pass);
        if(!old_pass || !new_pass){
            return ep.emit('info_error', '密码不能为空');
        }
        var old_keypass=tools.encrypt(old_pass);  //旧密码加密
        var new_keypass=tools.encrypt(new_pass);  //新密码加密
        UserModel.getUserInfo(current_user._id, old_keypass, function(err, user){
            if(!user){
                return ep.emit('info_error', '当前密码不正确');
            }
            UserModel.updateUserPass(current_user._id, new_keypass, function(err, result){
                if(result){
                    res.render('user/myset',{success: '密码修改成功', current_user: current_user});
                }else{
                    return ep.emit('info_error', '密码修改失败');
                }
            });

        });
    }



}


