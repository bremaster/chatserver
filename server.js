// var { Server }  = require('socket.io');
var socket  = require('socket.io');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
// const cors = require("cors");
// var io      = new Server(server);

options={ 
 cors:true,
 origins: "https://app.zoopr.io/",
}

var io      = socket(server, options);
var port    = process.env.PORT || 3000;

var router = express.Router();

router.get('/', function (req, res) {
  res.send('Wiki home page. Mr');
})

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// var corsOptions = {
//   "origin": ["http://localhost"],
//   "optionsSuccessStatus": 204,
//   "credentials": true
// }

// app.use(cors(corsOptions));

app.use(router);


io.on('connection', function (socket) {

  socket.on( 'room', function( data ) {
    io.sockets.emit( 'room', {
    	id_user_sender      : data.id_user_sender,
    	id_user_receiver    : data.id_user_receiver,
    	id_room             : data.id_room,
    	name_receiver       : data.name_receiver,
    	name_sender         : data.name_sender,   
    	message             : data.message,
      type_message        : data.type_message,
      file                : data.file,
      created_date        : data.created_date,
    });
  });

  socket.on( 'chat', function( data ) {
    io.sockets.emit( 'chat', {
      id_user_sender      : data.id_user_sender,
    	id_message          : data.id_message,
    	id_user_receiver    : data.id_user_receiver,
    	id_room             : data.id_room,
    	message             : data.message,
      type_message        : data.type_message,
      file                : data.file,
      created_date        : data.created_date,
    });
  });

  socket.on( 'ketik', function( data ) {
    io.sockets.emit( 'ketik', {
      id_room             : data.id_room,
      id_user_sender      : data.id_user_sender,
    	id_user_receiver    : data.id_user_receiver,
    	status              : data.status,
    });
  });

  socket.on( 'online', function( data ) {
    io.sockets.emit( 'online', {
      id_room             : data.id_room,
      id_user_sender      : data.id_user_sender,
    	id_user_receiver    : data.id_user_receiver,
    	status              : data.status,
    });
  });

  socket.on( 'notification', function( data ) {
    io.sockets.emit( 'notification', {
      status      : 'OK',
      id: data.id
    });
  });
});