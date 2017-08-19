const app = require('./helpers/app');
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

		app.database().goOnline();
		return app.database().ref('/properties-simplified').child(id).set(simplified);
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

		app.database().goOnline();
		return Promise.all([
			app.database().ref('/properties').child(id).set({ id }),
			app.database().ref('/properties-simplified').child(id).set(simplified)
		]);
	});

exports.delete = functions.database.ref('/properties/{id}')
	.onDelete(event => {
		const id = event.params.id;

		app.database().goOnline();
		return app.database().ref('/properties-simplified').child(id).remove();
	});
