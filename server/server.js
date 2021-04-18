const http = require('http');
const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const { generateMessege, generateLocationMessege } = require('./utils/messege');
const { isValidString } = require('./utils/isValid');
const { Users } = require('./utils/user');

let users = new Users();

const app = express();
let server = http.createServer(app);
let io = socketIO(server);

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3030;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('A new user just connected');

	socket.on('join', (params, callback) => {
		if (!isValidString(params.name) || !isValidString(params.room)) {
			return callback('Name and room is required');
		}
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
		socket.emit('newMessege', generateMessege('Admin', `Welocome to ${params.room}!`));

		socket.broadcast.to(params.room).emit('newMessege', generateMessege('Admin', 'New User Joined!'));

		callback();
	});

	socket.on('createMessege', (messege, callback) => {
		// console.log('createMessege', messege);
		let user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newMessege', generateMessege(user.name, messege.text));
		}
		// io.emit('newMessege', generateMessege(messege.from, messege.text));
		callback('This is server');
	});

	socket.on('createLocationMessege', (coords) => {
		let user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newLocationMessege', generateLocationMessege(user.name, coords.lat, coords.lng));
		}
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
		let user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
			io
				.to(user.room)
				.emit('newMessage', generateMessege('Admin', `${user.name} has left ${user.room} chat room.`));
		}
	});
});

server.listen(port, () => {
	console.log('Server is connected');
});
