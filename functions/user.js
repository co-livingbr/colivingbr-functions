const app = require('./helpers/app');
const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const { checkProperties, isEmpty } = require('./helpers/check');

/**
 * Cria um handler pra request.
 * @param {function(e.Request, e.Response)} callback
 */
const onRequest = callback => functions.https.onRequest((req, res) => {
	return cors(req, res, () => callback(req, res))
});

/**
 * TODO: Customizar as mensagens de erro do Firebase.
 */

exports.signUp = onRequest((req, res) => {
	const isValid = checkProperties(req.body, 'email', 'password', 'name', 'picture', 'password_confirmation');

	if (!isValid) {
		res.status(500).send('Um parâmetro ou mais está vazio.');
		return;
	}

	if (req.body.password !== req.body.password_confirmation) {
		res.status(500).send('A senha e a confirmação da senha não coincidem.');
		return;
	}

	const user = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		picture: req.body.picture
	};

	app.database().goOnline();
	app.auth()
		.createUser({
			email: user.email,
			password: user.password,
			emailVerified: false,
			displayName: user.name,
			photoURL: user.picture,
			disabled: false
		})
		.then(response => {
			user.id = response.uid;

			return app.database().ref('/users').child(user.id).set(user);
		})
		.then(() => res.status(200).send('Usuário criado com sucesso!'))
		.catch(error => res.status(500).send(error.message));
});
