			var socket = io.connect('http://localhost:8080');
			var username;

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
				var new_message = document.createElement('p');
				new_message.innerHTML=message;
				new_chat_message.appendChild(new_message);

				new_chat.appendChild(new_chat_user);
				new_chat.appendChild(new_chat_timestamp);
				new_chat.appendChild(new_chat_message);

				console.appendChild(new_chat);
				document.getElementById("chat_console").scrollTop= document.getElementById("chat_console").scrollHeight;


			}


			 document.getElementById('entry_form').onsubmit = function(e) {
			 	e.preventDefault();
			 	username = document.getElementById('username').value;
			 	if(!username){
			 		alert("Please enter username");
			 		return false;
			 	}	
				socket.emit('join', username);
				document.getElementById('username').value = null;
			};

			 document.getElementById('chat_form').onsubmit = function(e) {
				e.preventDefault();
				var time = getTimer();
				var message = document.getElementById('chat_input').value;
				var chatMessage = username + "@" + time + "," + message;
				socket.emit('messages', chatMessage);
				createHTML(chatMessage);
				// var new_message = document.createElement('span');
				// new_message.innerHTML = chatMessage+'<br/>';
				// var console = document.getElementById('chat_console');
				// console.appendChild(new_message);
				
				chat_input.value=null;

			};

			// socket.on('connect', function(data){
			// 	alert("Hello!");

			// });
			socket.on('messages', function(chatMessage){

			// var new_message = document.createElement('span');
			// new_message.innerHTML = chatMessage + '<br/>';
			// var console = document.getElementById('chat_console');
			// console.appendChild(new_message);
			// document.getElementById("chat_console").scrollTop= document.getElementById("chat_console").scrollHeight;
			createHTML(chatMessage);
			
			 });

			document.getElementById("leave_chat").onclick = function(e) {
				e.preventDefault();
				alert("hello there")
				socket.emit('leave_chat', username);
				document.getElementById("chat_console").innerHTML ="";
				socket.username=null;
			};
