const { database } = require('./helpers/app');
const { checkProperties } = require('./helpers/check');
const functions = require('firebase-functions');

exports.update = functions.database.ref('/properties/{id}')
	.onUpdate(event => {
		const id = event.params.id;
		const property = event.data.val();
		const simplified = {
			id,
			title: property.title,
			description: property.description,
			image: property.images[0] // Possivelmente
		};

		database().goOnline();
		return database().ref('/properties-simplified').child(id).set(simplified);
	});

exports.create = functions.database.ref('/properties/{id}')
	.onCreate(event => {
		const id = event.params.id;
		const property = event.data.val();
		const simplified = {
			id,
			title: property.title,
			description: property.description,
			image: property.images[0] // Possivelmente
		};

		database().goOnline();
		return Promise.all([
			database().ref('/properties').child(id).set({ id }),
			database().ref('/properties-simplified').child(id).set(simplified)
		]);
	});

exports.delete = functions.database.ref('/properties/{id}')
	.onDelete(event => {
		const id = event.params.id;

		database().goOnline();
		return database().ref('/properties-simplified').child(id).remove();
	});

exports.filter = functions.https.onRequest((req, res) => {
	const filters = {
		type: req.body.type,
		location: req.body.location,
		price: req.body.price
	}

	database().goOnline()

	let query = database().ref('/properties-simplified')

	if (filters.type)
		query = query.equalTo('type', filters.type)

	if (filters.price && filters.price[0] && filters.price[1]) {
		query = query.orderByChild('price').startAt(filters.price[0]).endAt(filters.price[1])
	}

	query.once('value', snapshot => {
		const properties = snapshot.val()

		const results = !filters.location ? properties : Object.keys(properties)
			.map(id => properties[id])
			.filter(property => property.location.includes(filters.location))
			.reduce((properties, property) => Object.assign({}, properties, { [property.id]: property }), {})

		res.status(200).send(results)
	})
})
