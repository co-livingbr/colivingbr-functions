const account = require('../config/account.json');
const admin = require('firebase-admin');

const app = admin.initializeApp({
	credential: admin.credential.cert(account),
	databaseURL: "https://colivingbr.firebaseio.com"
});

module.exports = app;
