/**
 * Created by zhoujialin on 2016/3/16.
 */

exports.formatTime = function(time){
    return time.toLocaleDateString()
                + ' '
                + time.toTimeString().replace(/\sGM.*$/, '');
}