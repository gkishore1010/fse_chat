var chatMessage = "username@Timestamp,Hi, this is Gayatri";
		var index = chatMessage.indexOf("@");
		var username = chatMessage.substring(0, index);
		var index2 = chatMessage.indexOf(",");
		var timeStamp = chatMessage.substring(index+1, index2);
		var message= chatMessage.substring(index2+1);
console.log("username: "+username);
console.log("timeStamp: "+timeStamp);
console.log("message: "+message);
console.log(index2);

