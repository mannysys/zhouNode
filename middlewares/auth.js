/**
 * Created by shadow on 2016.3.12.
 */

/*
   检查用户是否登录过
 */
exports.requireLogin = function(req, res, next){
    if(req.session.user){
        return next();//继续执行
    }
    res.status(402);
    res.redirect('/signin');//没有登录就跳转到登录页
}