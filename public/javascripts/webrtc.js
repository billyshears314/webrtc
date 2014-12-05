var myPeerId;
var mystream;

$(document).ready(function() {

	peer = new Peer({ key: 'lwjd5qra8257b9'});

	peer.on('open', function(id){
		myPeerId = id;
	});

    // Wait for a connection from the second peer.
	peer.on('connection', function(connection) {
		console.log("CONNECTION");

      connection.on('open', function() {
        // Send 'Hello' on the connection.
        connection.send('I guess I\'ll connect with you.');
      });
      
      // The `data` event is fired when data is received on the connection.
      connection.on('data', function(data) {
         console.log(data);
         $('#chatbox').append(data + '<br>');
      });
   });
   
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	navigator.getUserMedia({video: true, audio: true}, function(stream) {
	mystream = stream;
	}, function(err) {
	  console.log('Failed to get local stream' ,err);
	});
	
	peer.on('call', function(call) {
	  navigator.getUserMedia({video: true, audio: true}, function(stream) {
	  console.log('answer');
	 call.answer(stream); // Answer the call with an A/V stream.
	 call.on('stream', function(remoteStream) {
	     $('#their-video').prop('src', URL.createObjectURL(stream));
	 });
	  }, function(err) {
	 console.log('Failed to get local stream' ,err);
	  });
	});

});



 