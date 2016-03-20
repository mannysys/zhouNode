/**
 * Created by zhoujialin on 2016/3/16.
 */
var moment = require('moment');
var crypto = require('crypto');

//exports.formatTime = function(time){
//    return time.toLocaleDateString()
//                + ' '
//                + time.toTimeString().replace(/\sGM.*$/, '');
//}


moment.locale('zh-cn'); // 使用中文
//格式化时间
exports.formatDate = function(date){
    return moment(date).fromNow();
    //return date.format('YYYY-MM-DD HH:mm');
};


//生成密码的md5值,密码加密
exports.encrypt = function(pass){
    return crypto.createHash('md5').update(pass).digest('hex');
};









