let socket = io();

function srcrollToDown () {
	let messeges = document.querySelector('#messages').lastElementChild;
	messeges.scrollIntoView();
}

socket.on('connect', () => {
	let searchQuery = window.location.search.substring(1);
	let params = JSON.parse(
		'{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}'
	);
	console.log('Connected to server');
	socket.emit('join', params, function (err) {
		if (err) {
			alert('input field must be valid');
			window.location.href = '/';
		} else {
			console.log('No Error');
		}
	});
	// socket.emit('createMessege', {
	// 	from: 'omp',
	// 	text: 'started learning socket io'
	// });
});
socket.on('disconnect', () => {
	console.log('disconnected to server');
});

socket.on('updateUsersList', (users) => {
	console.log(users);
	let ol = document.createElement('ol');
	users.forEach((user) => {
		let li = document.createElement('li');
		li.innerHTML = user;
		ol.appendChild(li);
	});
	let usersList = document.querySelector('#users');
	usersList.innerHTML = '';
	usersList.appendChild(ol);
});

socket.on('newMessege', (messege) => {
	if (messege.text) {
		const formattedTime = moment(messege.createdAt).format('LT');
		const templates = document.querySelector('#message-template').innerHTML;
		const html = Mustache.render(templates, {
			from: messege.from,
			text: messege.text,
			createdAt: formattedTime
		});
		const div = document.createElement('div');
		div.innerHTML = html;
		document.querySelector('#messages').append(div);
	}
	// const formattedTime = moment(messege.createdAt).format('LT');
	// console.log('newMessege', messege);
	// let li = document.createElement('li');
	// li.innerText = `${messege.from} ${formattedTime}:  ${messege.text}`;
	// document.querySelector('#messages').appendChild(li);
	srcrollToDown();
});

socket.on('newLocationMessege', (messege) => {
	const formattedTime = moment(messege.createdAt).format('LT');
	console.log('newLocationMessege', messege);
	const templates = document.querySelector('#my-location').innerHTML;
	const html = Mustache.render(templates, {
		from: messege.from,
		url: messege.url,
		createdAt: formattedTime
	});
	const div = document.createElement('div');
	div.innerHTML = html;
	document.querySelector('#messages').append(div);
	// const formattedTime = moment(messege.createdAt).format('LT');
	// console.log('newLocationMessege', messege);
	// let li = document.createElement('li');
	// let a = document.createElement('a');
	// li.innerText = `${messege.from} ${formattedTime}: `;
	// a.setAttribute('target', '_blank');
	// a.setAttribute('href', messege.url);
	// a.innerText = 'my current location';
	// li.appendChild(a);
	// document.querySelector('#messages').appendChild(li);
	srcrollToDown();
});

// socket.emit(
// 	'createMessege',
// 	{
// 		from: 'John',
// 		text: 'Hey'
// 	},
// 	(messege) => {
// 		console.log('got it', messege);
// 	}
// );

document.querySelector('#submit-btn').addEventListener('click', (e) => {
	e.preventDefault();

	socket.emit(
		'createMessege',
		{
			from: 'User',
			text: document.querySelector('input[name="message"]').value
		},
		() => {}
	);
	document.querySelector('input[name="message"]').value = '';
});

document.querySelector('#send-location').addEventListener('click', (e) => {
	e.preventDefault();
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser');
	}
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('createLocationMessege', {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		});
	}),
		() => {
			alert('Unable to fetch position');
		};
});
