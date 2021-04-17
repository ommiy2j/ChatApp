let socket = io();
socket.on('connect', () => {
	console.log('Connected to server');
	// socket.emit('createMessege', {
	// 	from: 'omp',
	// 	text: 'started learning socket io'
	// });
});
socket.on('disconnect', () => {
	console.log('disconnected to server');
});


socket.on('newMessege', (messege) => {
    console.log('newMessege',messege)
})