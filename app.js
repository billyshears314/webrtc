var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var io = require('socket.io').listen(app.listen(8080));
var userData = [];
var index = 0;
var playerNumbers = [];

io.sockets.on('connection', function (socket) {

	if(playerNumbers.length>0){
		socket.usernumber = getLowestNumber();
	}
	else{
		socket.usernumber = 0;	
	}
	playerNumbers.push(socket.usernumber);
	//change to just self
	io.sockets.emit('getUsers', userData);
	 
	 
    socket.on('send', function (data) {
        socket.broadcast.emit('receive', data);
    });
    
    socket.on('addUser', function(data){
    	userData[userData.length] = data;
    	console.log(JSON.stringify(userData[userData.length-1]));
    	io.sockets.emit('getUsers', userData);
    });
    
    socket.on('getUsers', function (data) {
        io.sockets.emit('getUsers', userData);
    });
    
   socket.on('disconnect', function(){

		var index = playerNumbers.indexOf(socket.usernumber);
		if (index > -1) {
    		playerNumbers.splice(index, 1);
    		userData.splice(index, 1);
		}
		console.log(JSON.stringify(playerNumbers));
		 io.sockets.emit('getUsers', userData);
		
  	});
  		console.log(JSON.stringify(playerNumbers));	
		
}); 

function getLowestNumber(){

	for(var i=0; i<playerNumbers.length; i++){
		if(playerNumbers.indexOf(i)<0){
			return i;	
		}	
	}
	
	return playerNumbers.length;
	
}

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
