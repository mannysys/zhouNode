/**
 * Created by zhoujialin on 2016/3/16.
 */
var moment = require('moment');
var crypto = require('crypto');

//格式化时间
//exports.formatTime = function(time){
//    return time.toLocaleDateString()
//                + ' '
//                + time.toTimeString().replace(/\sGM.*$/, '');
//}


moment.locale('zh-cn'); //显示中文
//格式化时间几天前
exports.formatDate = function(date){
    return moment(date).fromNow();
    //return date.format('YYYY-MM-DD HH:mm');
};


//将密码md5加密
exports.encrypt = function(pass){
    return crypto.createHash('md5').update(pass).digest('hex');
};

//验证数据
exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};





