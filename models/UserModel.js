/**
 * 数据模型
 * 添加用户数据和查询用户数据的
 */
var mongoose = require('./db').mongoose;

var UserSchema = new mongoose.Schema({
    username: String,       //用户名
    pass: String,           //密码
    email: String,          //邮箱
    location: String,       //所在地
    avatar: String,         //头像地址
    signature: String,      //签名
    weibo: String,          //微博
    create_at: {type: Date, default: Date.now },   //注册时间
    update_at: {type: Date, default: Date.now },   //更新时间
    score: { type: Number, default: 0 },           //分数
    level: { type: String, default: '绅士' },  //级别
    follow_count: { type: Number, default: 0 },  //关注数
    topic_count: { type: Number, default: 0 },  //话题数量
    reply_count: { type: Number, default: 0 }  //评论数量

});


UserSchema.statics.getUserBySignupInfo = function(username, email, callback){
    // 第一个$or表示或者，第二个是查询条件
    var cond = {'$or':[{username: username},{email: email}]};

    this.find(cond, callback);
};

UserSchema.statics.addUser = function(user, callback){
    //添加数据
    this.create(user, callback);
};


UserSchema.statics.getUser = function(username, pass, callback){
    //查询只返回一条数据
    this.findOne({username:username, pass:pass}, callback);
};


//更新密码
UserSchema.statics.getUserInfo = function(_id, pass, callback){
    // 查询用户_id和密码是否正确
    var cond = {'$and':[{_id: _id},{pass: pass}]};
    this.findOne(cond, callback);
};

UserSchema.statics.updateUserPass = function(_id, pass, callback){
    //修改用户密码
    this.update({_id: _id}, {$set:{ pass: pass}}, callback);

};

//保存用户设置
UserSchema.statics.getUserById = function(_id, callback){
    //查询用户数据
    this.findById(_id, callback);
};




module.exports = mongoose.model('User', UserSchema); //生成数据模型





