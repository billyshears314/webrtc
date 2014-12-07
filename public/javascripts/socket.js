var socket = io.connect('http://192.168.1.143:8080');
var peerIDs = [];
var otherPeerID;
var c;
 
$(function(){
	
	$('#addUserButton').click(function(){
		socket.emit('addUser', {username: $('#usernameField').val(), id: myPeerId});
		$('#usernameField').val('');
	});
	
	$('#sendMessage').click(function(){
	 	  sendMessage();
	});
	
	$("input").keyup(function(e) {
	e.preventDefault();
	
		if(e.keyCode == 13) {
			sendMessage();
  		}
	});
	
	function sendMessage(){
		var temp = $('#chatfield').val();		 	  
	  	  c.send(temp);
 		  $('#chatbox').append(temp + '\n');
  		  $('#chatfield').val('');
	}
	
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
 				//$('#userlist').append('<strong>me - </strong>');
 			}
 			else{
 				$('#userlist').append('<button id=connectUserButton'+i+' class="connect btn btn-success" type="button">Connect</button>');
 			
		 		$('.connect').click(function(){
		
					var buttonID = $(this).attr('id');	

					buttonID = parseInt(buttonID.substring(buttonID.length-1, buttonID.length));
					otherPeerID = peerIDs[buttonID];

				   //Connect for Text Messaging
					c = peer.connect(otherPeerID);
				
				   c.on('data', function(data) {
         			$('#chatbox').append(data + '\n');
      			});
	
				   //Connect for Video Chatting		
					var call = peer.call(otherPeerID, mystream);	
	
					call.on('stream', function(remoteStream) {
	 				  $('#their-video').prop('src', URL.createObjectURL(remoteStream));
	 				 });	 
		   
				});
				$('#userlist').append('<strong>'+data[i].username+'</strong><br>');
 			}
 			
 			
 			peerIDs.push(data[i].id);
 		}

 		
	});
 	
});