/**
 * Created by shadow on 2016.3.13.
 */
var topicModel = require('../models/TopicModel');
var eventproxy = require('eventproxy');
var _ = require('lodash');
var timeHelper = require('../time_helper');

exports.index = function(req, res){
    //如果接转换整型数值失败就返回默认值为1
    var page = parseInt(req.query.page) || 1;
    //如果page小于0了就默认赋值为1
    page = page > 0 ? page : 1;
    //判断tab没有值，默认为all所有
    var tab = req.query.tab || 'all';
    var query = {};
    if(tab !== 'all'){
        query.tab = tab;
    }
    var ep = new eventproxy();
    var count = 10;
    // 在查询数据时skip表示跳过(page-1)*count
    // limit表示选择10条查询数据
    //-insertTime表示按时间倒序排序
    var option = {skip: (page-1)*count, limit: count, sort: '-insertTime'};
    topicModel.getTopics(query, option, function(err, topics){
        //将topics中时间格式进行转换,增加一个timeStr字段时间转换格式
        topics = _.map(topics, function(topic){
            topic.timeStr = timeHelper.formatTime(topic.insertTime);
            return topic;
        });
        //抛出事件topic_data_ok，携带查询的数据topics
        ep.emit('topic_data_ok', topics);
    });
    //获取出总共多少页,count是mongodb自带函数
    topicModel.count(query, function(err, allCount){
        // 获取到总共数据然后向上取整，转换成页数
        var pageCount = Math.ceil(allCount/count);
        ep.emit('page_count_ok', pageCount);
    });
    //接收抛出的事件
    ep.all('topic_data_ok', 'page_count_ok', function(topics, pageCount){
        res.render('index', {topics:topics, tab:tab, page:page, pageCount:pageCount});
    });



}





















