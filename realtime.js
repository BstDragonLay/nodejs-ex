module.exports = function(server, sessionMiddleware){
  var io = require('socket.io')(server);
  var redis = require('redis');
  var client = redis.createClient();
  //subscribir a un canal
  client.subscribe("images");

  io.use(function(socket, next){
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  //callback
  client.on("message", function(channel, message){
    if(channel == "images") {
      io.emit("nuevaimagen", message)
    }
  });

  //

  io.sockets.on("connection", function(socket){
    console.log(socket.request.session.user_id);
  });
}
