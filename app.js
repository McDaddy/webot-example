var express = require('express');
var webot = require('weixin-robot');

var log = require('debug')('webot-example:log');
var verbose = require('debug')('webot-example:verbose');

// 启动服务
var app = express();

// 实际使用时，这里填写你在微信公共平台后台填写的 token
var wx_token = process.env.WX_TOKEN || 'cwt123456';

// remove this test code in production environment
//try {
  // for submodulized repository only
  //webot = require('../');
//} catch (e) {}

// app.use(express.query());
app.use(express.cookieParser());
// 为了使用 waitRule 功能，需要增加 session 支持
// 你应该将此处的 store 换为某种永久存储。请参考 http://expressjs.com/2x/guide.html#session-support
app.use(express.session({ secret: 'abced111', store: new express.session.MemoryStore() }));

// 启动机器人, 接管 web 服务请求，默认会监听根目录请求
webot.watch(app, { token: wx_token, path: '/' });

// 载入路由规则
require('./rules')(webot);

// 在环境变量提供的 $PORT 或 3000 端口监听
var port = process.env.PORT || 3000;
app.listen(port, function(){
  log("Listening on %s", port);
});

// 微信后台只允许 80 端口，你可能需要自己做一层 proxy
app.enable('trust proxy');

// 当然，如果你的服务器允许，你也可以直接用 node 来 serve 80 端口
// app.listen(80);

if(!process.env.DEBUG){
  console.log("set env variable `DEBUG=webot-example:*` to display debug info.");
}
