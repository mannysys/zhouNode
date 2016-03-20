/**
 * Created by shadow on 2016.3.12.
 */
var validator = require('validator');
var TopicModel = require('../models/TopicModel');
var eventproxy = require('eventproxy');
var tools = require('../common/tools');  //工具
var ReplyModel = require('../models/ReplyModel');
var _ = require('lodash');

//处理显示创建话题页面
exports.showCreate = function(req, res){
    res.render('topic/create');
};

//处理提交话题信息
exports.create = function(req, res){
    // trim去掉字符串的两端空格
    var title = validator.trim(req.body.title);
    var tab = validator.trim(req.body.tab);
    var content = validator.trim(req.body.t_content);

    var hasEmptyInfo = [title, tab, content].some(function(item){
       return  item === '';
    });
    if(hasEmptyInfo){
        res.status(422);
        return res.render('topic/create', {error: '您填写的信息不完整'});
    }
    var topicData = {
        title: title,
        content: content,
        tab: tab,
        username: req.session.user.username,
        insertTime: Date.now()
    };
    TopicModel.addTopic(topicData, function(err, result){
        return res.render('topic/create', {success: '发表话题成功！'});

    });

};

//处理文章查询详情
exports.detail = function(req, res){
    var topicId = req.params.tid;
    var ep = new eventproxy(); //异步事件

    TopicModel.getTopic(topicId, function(err, topic){
        topic.timeStr = tools.formatDate(topic.insertTime);
        ep.emit('topic_data_ok', topic);
    });
    //获取出文章评论总共多少条
    ReplyModel.count({topicId: topicId}, function(err, count){
        ep.emit('reply_count_ok', count);
    });
    //获取出文章评论列表
    ReplyModel.getReplys(topicId, function(err, replys){
        replys = _.map(replys, function(reply){
            reply.timeStr = tools.formatDate(reply.insertTime);
            return reply;
        });
        ep.emit('replys_data_ok', replys);
    });
    //接收抛出的事件
    ep.all('topic_data_ok', 'reply_count_ok', 'replys_data_ok', function(topic, count, replys){
        res.render('topic/detail', {topic: topic, count: count, replys: replys});
    });



};















