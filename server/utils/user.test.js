const expect = require('expect');

const { User } = require('./user');

describe('User', () => {
	it('should add new user', () => {
		let users = new User();
		let user = {
			id: '545465',
			name: 'Om',
			room: 'wer'
		};
		let reUser = users.addUser(user.id, user.name, user.room);
		expect(user.users).toEqual([ user ]);
	});
});
