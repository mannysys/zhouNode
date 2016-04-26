/**
 * 数据模型
 * 创建话题
 */
var mongoose = require('./db').mongoose;


var TopicSchema = new mongoose.Schema({
    title: String,
    content: String,
    tab: String,
    username: {
        type: mongoose.Schema.ObjectId, //该字段关联用户user集合
        ref: 'User'  //指定关联User集合
    },
    insertTime: Date
});

//添加数据
TopicSchema.statics.addTopic = function(topic, callback){
    this.create(topic, callback);
};

//列表数据
TopicSchema.statics.getTopics = function(query, option, callback){
    this.find(query, {}, option).populate('username').exec(callback);

};

//查询文章详情内容
TopicSchema.statics.getTopic = function(topicId, callback){
    this.findOne({_id: topicId}).populate('username').exec(callback);
};

//根据用户查询发的文章
TopicSchema.statics.getUserTopic = function(uid, option, callback){
    this.find({username: uid}, {}, option).populate('username').exec(callback);
};


module.exports = mongoose.model('Topic', TopicSchema); //生成数据模型











