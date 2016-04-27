/**
 * 数据模型
 * 添加用户数据和查询用户数据的
 */
'use strict';
var mongoose = require('./db').mongoose;


var ReplySchema = new mongoose.Schema({
    topicId: String,
    content: String,
    username: {
        type: mongoose.Schema.ObjectId, //该字段关联用户user集合
        ref: 'User'  //指定关联User集合
    },
    insertTime: Date
});


//添加数据
ReplySchema.statics.addReply = function(reply, callback){
    this.create(reply, callback);
};

//查询符合条件所有数据
ReplySchema.statics.getReplys = function(topicId, option, callback){
    this.find({topicId: topicId}, {}, option).populate('username').exec(callback);
};


//根据用户查询发的评论
ReplySchema.statics.getUserReply = function(uid, option, callback){
    this.find({username: uid}, {}, option).populate('username').exec(callback);
};


module.exports = mongoose.model('Reply', ReplySchema); //生成数据模型
