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


moment.locale('zh-cn'); // ʹ������
//��ʽ��ʱ��
exports.formatDate = function(date){
    return moment(date).fromNow();
    //return date.format('YYYY-MM-DD HH:mm');
};


//���������md5ֵ,�������
exports.encrypt = function(pass){
    return crypto.createHash('md5').update(pass).digest('hex');
};









