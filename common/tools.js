/**
 * Created by zhoujialin on 2016/3/16.
 */
var moment = require('moment');
var crypto = require('crypto');

//����ʱ���ʽ
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

//����ƥ���Сд��ĸa-z��������0-9���ַ���
exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};







