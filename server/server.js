const { static } = require('express');
const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
let server = http.createServer(app);
let io = socketIO(server);

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3030;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('A new user just connected');
    

	socket.emit('newMessege', {
		from: 'Admin',
		text: 'Welcome to the chat app',
		createdAt: new Date().getTime()
	});
	socket.broadcast.emit('newMessege', {
		from: 'Admin',
		text: 'new user Join the chat',
		createdAt: new Date().getTime()
	});

	// socket.on('createMessege', (messege) => {
	// 	console.log('createMessege', messege);
	// 	io.emit('newMessege', {
	// 		from: messege.from,
	// 		text: messege.text,
	// 		createdAt: new Date().getTime()
	// 	});
	// 	// socket.broadcast.emit('newMessege', {
	// 	// 	from: messege.from,
	// 	// 	text: messege.text,
	// 	// 	createdAt: new Date().getTime()
	// 	// });
	// });

	socket.on('disconnect', (socket) => {
		console.log(' user was disconnected');
	});
});

server.listen(port, () => {
	console.log('Server is connected');
});
