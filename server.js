// var { Server }  = require('socket.io');
var socket  = require('socket.io');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('https://goerli.infura.io/v3/037e409742d34513901d6b0fc5486d1d');
const web3 = new Web3(provider);
const apiToken = 'R8SY74NZ9PGKJAAEMB2G459UZRRAID65KN';

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


// Transactions
let latestKnownBlockNumber = -1;
let blockTime = 5000;

// Our function that will triggered for every block
async function processBlock(blockNumber) {
  latestKnownBlockNumber = blockNumber;
}

// This function is called every blockTime, check the current block number and order the processing of the new block(s)
async function checkCurrentBlock() {
  const currentBlockNumber = await web3.eth.getBlockNumber()
  while (latestKnownBlockNumber == -1 || currentBlockNumber > latestKnownBlockNumber) {
    if(currentBlockNumber > latestKnownBlockNumber) {
      let detail = await web3.eth.getBlock(currentBlockNumber);
      for (var i = detail.transactions.length - 1; i >= 0; i--) {
        let transaction = await web3.eth.getTransaction(detail.transactions[i]);
      }
    } else {
      console.log("empty")
    }

    await processBlock(latestKnownBlockNumber == -1 ? currentBlockNumber : latestKnownBlockNumber + 1);
  }
  setTimeout(checkCurrentBlock, blockTime);
}

checkCurrentBlock()