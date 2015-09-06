var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//to load files from the public folder
app.use(express.static(__dirname + '/public'));

//DB setup code
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./chat.db');

//create tables
db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS chats_table (name VARCHAR(30), time TEXT, message TEXT)");
	db.run("CREATE TABLE IF NOT EXISTS users_table (name VARCHAR(30))");
});

io.on('connection', function(client){

	
	 
	 client.on('join', function(name){
	 	client.username = name;
	 	console.log(name + ' connected...');

	 	//insert client into table of active usernames
	 	db.serialize(function(){	
	 		var stmt = db.prepare("INSERT INTO users_table VALUES (?)");
	 		stmt.run(name);
	 		stmt.finalize();
		});

		//load existing chat messages onto client
	 	db.each("SELECT rowid as id, name, time, message FROM chats_table", function(err,row){
	 		var chatMsg = row.name+"@"+row.time+","+row.message;
	 		client.emit("messages", chatMsg);
		});
	});
	
	 //get chat messages and add to database
	 client.on('messages', function(chatMessage){
		console.log(chatMessage);
		client.broadcast.emit('messages', chatMessage);				
		var index = chatMessage.indexOf("@");
		var username = chatMessage.substring(0, index);
		var index2 = chatMessage.indexOf(",");
		var timeStamp = chatMessage.substring(index+1, index2);
		var message= chatMessage.substring(index2+1);	

		db.serialize(function(){	
			var stmt = db.prepare("INSERT INTO chats_table (name, time, message) VALUES (?,?,?)");
			stmt.run(username, timeStamp, message);
			stmt.finalize();
		});

		
	});

	//remove user from table of active usernames
	client.on('leave_chat', function (username){

		 db.run("DELETE FROM users_table WHERE name= ?", [username], function(err){
		 	if(err){
		 	console.log(err);
		 	}
		 });
		console.log(username + " has left chatroom");
		
	});

	
	client.on('disconnect', function(){
		console.log("client disconnected..");
	});
});	

//load index.html on route /
app.get('/', function (req, res) {
 res.sendFile(__dirname + '/index.html');
});
server.listen(8080);