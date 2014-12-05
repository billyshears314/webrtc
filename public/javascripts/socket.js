var socket = io.connect('http://localhost:8080');
var peerIDs = [];
 
$(function(){

	$('#sendButton').click(function(){	
		socket.emit('send', {message: "Hello, I'm Harry Potter."});
	}); 	
	
	$('#addUserButton').click(function(){
		socket.emit('addUser', {username: $('#usernameField').val(), id: myPeerId});
		$('#usernameField').val('');
	});
	
	
	socket.on('receive', function(data){
 		console.log("I've received message.");
 		console.log(data.message);
	});
	
	socket.on('getUsers', function(data){
 		console.log(JSON.stringify(data));
 		$('#userlist').html('');
 		peerIDs = [];
 		for(var i=0; i<data.length; i++){ 			
 			if(data[i].id==myPeerId){
 				$('#userlist').append('<strong>me - </strong>');
 			}
 			else{
 				$('#userlist').append('<button id=connectUserButton'+i+' class="sendMessageButton" type="button">Send Message</button>');
 			
 				
		 		$('.sendMessageButton').click(function(){
					console.log('click');
					var buttonID = $(this).attr('id');	

					buttonID = parseInt(buttonID.substring(buttonID.length-1, buttonID.length));

					var c = peer.connect(peerIDs[buttonID]);
					var call = peer.call(peerIDs[buttonID], mystream);	
					console.log('test');
					 call.on('stream', function(remoteStream) {
				
	 				  $('#their-video').prop('src', URL.createObjectURL(remoteStream));
	 				 });	 
		 
		  		 c.on('data', function(data) {
		   	  // When we receive 'Hello', send ' world'.
				var temp = $('#usernameField').val();		   	  
		   	  console.log(temp);
		   	  c.send(temp);
 				  $('#chatbox').append(temp + '<br>');
 				 
		  		  $('#usernameField').val('');
		  		 
		  		 });
		   
				});
 			}
 			$('#userlist').append('<strong>'+data[i].username+'</strong><br>');
 			
 			peerIDs.push(data[i].id);
 		}

 		
	});
 	
});