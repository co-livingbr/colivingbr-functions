const account = require('./config/account.json');
const functions = require('firebase-functions');
const { initializeApp, credential } = require('firebase-admin');

const app = initializeApp({
	credential: credential.cert(account),
	databaseURL: "https://colivingbr.firebaseio.com"
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateProperties = functions.database.ref('/properties/{id}')
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
		return app.database().ref('/properties-simplified').child(id).set(property);
	});

exports.createProperties = functions.database.ref('/properties/{id}')
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
		return app.database().ref('/properties-simplified').child(id).set(property);
	});

exports.updateProperties = functions.database.ref('/properties/{id}')
	.onDelete(event => {
		const id = event.params.id;

		app.database().goOnline();
		return app.database().ref('/properties-simplified').child(id).remove();
	});
