const moment = require("moment");

let generateMessege = (from, text) => {
	return {
		from,
		text,
		createdAt: moment().valueOf()
	};
};

let generateLocationMessege = (from,lat,lng) => {
	return {
		from,
		url: `https://www.google.com/maps?q=${lat},${lng}`,
		createdAt: moment().valueOf()
	}
}

module.exports = { generateMessege,generateLocationMessege };
