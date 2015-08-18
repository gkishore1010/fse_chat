			var server = io.connect('http://localhost:8080');
			var nickname;
			function getTimer(){
				var d = new Date();
				var hr = d.getHours();
				var min = d.getMinutes();
				var sec = d.getSeconds();
				var dt= (d.getDate()).toString();
				var mt = (d.getMonth()).toString();
				var yr = (d.getFullYear()).toString();
				var fullDate = mt+"/" +dt+"/" +yr+"   "+ hr+":"+min+":"+sec;
				return fullDate;
			}
			document.getElementById('entry_form').onsubmit = function(e) {
				e.preventDefault();
				nickname = document.getElementById('username').value;
				server.emit('join', nickname);
				document.getElementById('username').value = null;
			};

			document.getElementById('chat_form').onsubmit = function(e) {
				e.preventDefault();
				var timer = getTimer();
				var message = document.getElementById('chat_input').value;
				server.emit('messages', message);
				var new_message = document.createElement('span');
				new_message.innerHTML = nickname + '@'+timer+' : ' +'<br/>'+ message + '<br/>';
				var console = document.getElementById('chat_console');
				console.appendChild(new_message);
				document.getElementById("chat_console").scrollTop= document.getElementById("chat_console").scrollHeight;
				chat_input.value=null;

			};
			server.on('connect', function(data){
				// var console = document.getElementById('chat_console');
				// nickname = prompt('What is your nickname?');
				// server.emit('join', nickname);

			});
			server.on('messages', function(data){
				var new_message = document.createElement('span');
				new_message.innerHTML = data + '<br/>';
				var console = document.getElementById('chat_console');
				console.appendChild(new_message);
				document.getElementById("chat_console").scrollTop= document.getElementById("chat_console").scrollHeight;
			});
			document.getElementById("leave_chat").onclick = function(e) {
				e.preventDefault();
				server.emit('remove user', nickname);
			};