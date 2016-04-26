/**
 * Created by zhoujialin on 2016/3/18.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');
var UserModel = require('../models/UserModel');
var TopicModel = require('../models/TopicModel');
var ReplyModel = require('../models/ReplyModel');
var _ = require('lodash');
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
        var defaultAvatar = validator.trim(req.body.defaultAvatar);

        UserModel.getUserById(current_user._id, function(err, user){
            user.avatar = defaultAvatar;
            user.location = location;
            user.weibo = weibo;
            user.signature = signature;
            user.update_at = Date.now();
            user.save(function(err){
                if(err){
                    return ep.emit('info_error', '保存设置失败');
                }
                req.session.user = user.toObject({virtual: true}); //更新session
                res.render('user/myset',{success: '保存设置成功', current_user: user});
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

exports.user = function(req, res){
    var uid = validator.trim(req.params.uname);
    var ep = new eventproxy(); //异步事件
    if(!uid){
        return;
    }
    var option = {limit: 5, sort: '-insertTime'};
    //查询该用户的发的文章
    TopicModel.getUserTopic(uid, option, function(err, topics){
        topics = _.map(topics, function(topic){
            topic.timeStr =  tools.formatDate(topic.insertTime);
            return topic;
        });
        //抛出事件，携带文章内容数据
        ep.emit('user_topic_ok', topics);
    });
    //查询该用户发的评论
    ReplyModel.getUserReply(uid, option, function(err, replys){
        replys = _.map(replys, function(reply){
            reply.timeStr =  tools.formatDate(reply.insertTime);
            return reply;
        });
        //抛出事件，携带评论数据
        ep.emit('user_reply_ok', replys);
    });

    //接收抛出事件和数据
    ep.all('user_topic_ok', 'user_reply_ok', function(userTopic, userReply){

        res.render('user/home', {userTopic: userTopic, userReply: userReply, current_user:req.session.user});
    });


}


