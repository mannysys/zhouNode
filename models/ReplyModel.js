/**
 * 数据模型
 * 添加用户数据和查询用户数据的
 */
'use strict';
var mongoose = require('./db').mongoose;


var ReplySchema = new mongoose.Schema({
    topicId: String,
    content: String,
    username: String,
    insertTime: Date
});


//添加数据
ReplySchema.statics.addReply = function(reply, callback){
    this.create(reply, callback);
};

//查询只返回一条数据
ReplySchema.statics.getReplys = function(topicId, callback){
    this.find({topicId: topicId}, callback);
};


module.exports = mongoose.model('Reply', ReplySchema); //生成数据模型
