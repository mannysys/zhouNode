/**
 * Created by zhoujialin on 2016/3/18.
 */
var mongoose = require('mongoose');
var uri = 'mongodb://siteAdmin:meigui12160@127.0.0.1:27017/node_club';
//var uri = 'mongodb://127.0.0.1/node_club';
mongoose.connect(uri);

exports.mongoose = mongoose;