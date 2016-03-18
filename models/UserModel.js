/**
 * 数据模型
 * 添加用户数据和查询用户数据的
 */
var mongoose = require('./db').mongoose;

var UserSchema = new mongoose.Schema({
    username: String,
    pass: String,
    email: String
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


module.exports = mongoose.model('User', UserSchema); //生成数据模型





