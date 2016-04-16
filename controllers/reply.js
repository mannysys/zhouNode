/**
 * Created by zhoujialin on 2016/3/16.
 */
var path = require('path');
var fs = require('fs');
var ReplyModel = require('../models/ReplyModel');
var tools = require('../common/tools');

exports.addReply = function(req, res){
    var topicId = req.body.topicId;
    var content = req.body.t_content;
    var username = req.session.user;

    //添加评论数据
    ReplyModel.addReply({
        topicId: topicId,
        content: content,
        username: username,
        insertTime: Date.now()
    }, function(err, result){

        res.redirect('/topic/'+topicId); //跳转到评论文章的详情页
    });

};

//处理上传的图片
exports.upload = function(req, res){
    //收到上传图片请求后，以管道的形式交给busboy处理
    req.pipe(req.busboy);
    //接收文件上传，就执行后面匿名函数方法
    // fieldname字段名字、file文件对象、filename文件名字、encoding使用的编码、mimetype文件类型
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
        // new Date().getTime()表示当前时间戳，然后转换字符串
        // path.extname获取文件的后缀名
        var newFilename = String(new Date().getTime()) + path.extname(filename);
        // 当前日期
        var nowDate = tools.formatDateFile(new Date());
        var filePath = __dirname + '/../public/upload/' + nowDate + '/' +newFilename;
        var url = '/public/upload/' + nowDate + '/' +newFilename; //上传文件新的路径
        // 检查目录路径
        var dirPath = __dirname + '/../public/upload/' + nowDate;
        fs.exists(dirPath, function(exists){
            if(exists){
                //将文件转换成管道形式，以流的形式写进指定路径
                file.pipe(fs.createWriteStream(filePath));
            }else{
                fs.mkdir(dirPath, function(err){
                    if(err){
                        return err;
                    }
                    //将文件转换成管道形式，以流的形式写进指定路径
                    file.pipe(fs.createWriteStream(filePath));
                });
            }
        });

        //文件写完结束后，执行以下函数返回信息
        file.on('end', function(){
            var fullpath = req.headers.origin + url;
            //res.json({success: true, url: url});
            res.send(fullpath); //返回文件url绝对路径

        });

    });

};














