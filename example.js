var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//test code

app.use(express.static(__dirname + '/public'));

//db code
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./chat.db');
//create tables

db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS Msg (chats TEXT )");
	db.run("CREATE TABLE IF NOT EXISTS Usr (chatters VARCHAR(30))");
});

io.on('connection', function(client){

	console.log('Client connected...');
	client.on('join', function(name){
		client.nickname = name;

		db.serialize(function(){	
			var stmt = db.prepare("INSERT INTO Usr VALUES (?)");
			stmt.run(name);
			stmt.finalize();
		});

		db.each("SELECT rowid as id, chats FROM Msg", function(err,row){
			client.emit("messages", row.chats);
		});
	});
	
	client.on('messages', function(data){
		var nickname = client.nickname;
		console.log(nickname + " : " + data);
		client.broadcast.emit("messages", nickname + " : " + data);	
		db.serialize(function(){	
			var stmt = db.prepare("INSERT INTO Msg VALUES (?)");
			stmt.run(nickname + " : " + data);
			stmt.finalize();
			});
		});

	client.on('remove user', function (nickname){
		console.log(nickname + " has left chatroom");
		db.each("SELECT chatters FROM Usr", function(err,row){
		console.log(row.chatters);
		console.log("before deletion");
		});
		db.run("DELETE FROM Usr WHERE chatters= ?", [nickname], function(err){
			if(err){
			console.log(err);
			}
		});
		db.each("SELECT chatters FROM Usr", function(err,row){
			console.log(row.chatters);
		});
			
	});
});	

app.get('/', function (req, res) {
 res.sendFile(__dirname + '/index.html');
});
server.listen(8080);