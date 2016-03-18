/**
 * 数据模型
 * 创建话题
 */
var mongoose = require('./db').mongoose;


var TopicSchema = new mongoose.Schema({
    title: String,
    content: String,
    tab: String,
    username: String,
    insertTime: Date
});

//添加数据
TopicSchema.statics.addTopic = function(topic, callback){
    this.create(topic, callback);
};

//列表数据
TopicSchema.statics.getTopics = function(query, option, callback){
    this.find(query, {}, option, callback);
};

//查询文章详情内容
TopicSchema.statics.getTopic = function(topicId, callback){
    this.findOne({_id: topicId}, callback);
};




module.exports = mongoose.model('Topic', TopicSchema); //生成数据模型











