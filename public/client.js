			var socket = io.connect('http://localhost:8080');
			var username;
//function to extract timestamp
			function getTimer(){
				var d = new Date();
				var hr = d.getHours();
				var min = d.getMinutes();
				var sec = d.getSeconds();
				var dt= (d.getDate()).toString();
				var mt = (d.getMonth()).toString();
				var yr = (d.getFullYear()).toString();
				var fullDate = mt+"/" +dt+"/" +yr+" "+ hr+":"+min+":"+sec;
				return fullDate;
			}

			function createHTML(chatMessage){


				var index = chatMessage.indexOf("@");
				var username = chatMessage.substring(0, index);
				var index2 = chatMessage.indexOf(",");
				var timeStamp = chatMessage.substring(index+1, index2);
				var message= chatMessage.substring(index2+1);
				var console=document.getElementById('chat_console');

				var new_chat = document.createElement('div');
				new_chat.className='chat_message';

				var new_chat_user = document.createElement('div');
				new_chat_user.className='username';
				new_chat_user.innerHTML=username;

				var new_chat_timestamp = document.createElement('div');
				new_chat_timestamp.className='timestamp';
				new_chat_timestamp.innerHTML=timeStamp;

				var new_chat_message = document.createElement('div');
				new_chat_message.className='message';
				new_chat_message.innerHTML=message;

				new_chat.appendChild(new_chat_user);
				new_chat.appendChild(new_chat_timestamp);
				new_chat.appendChild(new_chat_message);

				console.appendChild(new_chat);
				document.getElementById("chat_console").scrollTop= document.getElementById("chat_console").scrollHeight;


			}

			function createHTMLChat(chatMessage){
				var index = chatMessage.indexOf("@");
				var username = chatMessage.substring(0, index);
				var index2 = chatMessage.indexOf(",");
				var timeStamp = chatMessage.substring(index+1, index2);
				var message= chatMessage.substring(index2+1);
				var console=document.getElementById('chat_console');

				var new_chat = document.createElement('li');
			}


			 document.getElementById('submit_button').onclick = function(e) {
			 	e.preventDefault();
			 	username = document.getElementById('username').value;
			 	if(!username){
			 		alert("Please enter username");
			 		return false;
			 	}
			 	if(username.indexOf(',') > -1 || username.indexOf('@') > -1){
			 		alert("Invalid character in username! Please re-enter username");
			 		return false;	
			 	}	
				socket.emit('join', username);
				document.getElementById('username').value = null;

				$("#leaveChat").show();
				$("#submit_button").hide();
				$("#username").hide();
				$("#chatRoom").show();
			};

			 document.getElementById('submitChat').onclick = function(e) {
				
				e.preventDefault();
				var time = getTimer();
				var message = document.getElementById('chat_input').value;
				var chatMessage = username + "@" + time + "," + message;
				socket.emit('messages', chatMessage);
				createHTML(chatMessage);
				chat_input.value=null;

			};


			socket.on('messages', function(chatMessage){

			createHTML(chatMessage);
			
			 });

			document.getElementById("leaveChat").onclick = function(e) {
				
				e.preventDefault();
				socket.emit('leave_chat', username);
				document.getElementById("chat_console").innerHTML ="";
				socket.username=null;

				$("#chatRoom").hide();
				$("#username").show();
				$("#submit_button").show();
				$("#leaveChat").hide();
				$("#username").focus();
			};
