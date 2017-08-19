const app = require('./helpers/app');
// const cors = require('cors')({ origin: true });
const functions = require('firebase-functions');
const { checkProperties, isEmpty } = require('./helpers/check');

exports.signUp = functions.https.onRequest((req, res) => {
	const isValid = checkProperties(req.body, ...[
		'firstName',
		'lastName',
		'email',
		'password',
		'picture',
		'gender',
		'birthDate',
		'phone',
		'about'
	]);

	if (!isValid) {
		res.status(500).send('Um parâmetro ou mais está vazio.');
		return;
	}

	if (req.body.password.length < 6) {
		res.status(500).send('A senha precisa ter ao menos 6 caracteres.');
		return;
	}

	if (req.body.password !== req.body.password_confirmation) {
		res.status(500).send('A senha e a confirmação da senha não coincidem.');
		return;
	}

	const user = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		picture: req.body.picture,
		gender: req.body.gender,
		birthDate: req.body.birthDate,
		phone: req.body.phone,
		about: req.body.about
	};

	app.database().goOnline();
	app.auth()
		.createUser({
			email: `${user.firstName} ${user.lastName}`,
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
