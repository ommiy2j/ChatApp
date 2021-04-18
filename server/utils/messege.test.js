let expect = require('expect');
const { generateMessege, generateLocationMessege } = require('./messege');

describe('Generate Messege', () => {
	it('should generate correct messege object', () => {
		let from = 'om',
			text = 'some random text',
			messege = generateMessege(from, text);
		expect(typeof messege.createdAt).toBe('number');
		expect(messege).toMatchObject({ from, text });
	});
});

describe('Generate Location', () => {
	it('should generate correct location object', () => {
		let from = 'om';
		(lat = 15),
			(lng = 56),
			(url = `https://www.google.com/maps?q=${lat},${lng}`),
			(messege = generateLocationMessege(from, lat, lng));
		expect(typeof messege.createdAt).toBe('number');
		expect(messege).toMatchObject({ from, url });
	});
});
