// const { refAuthCustomerValidation } = require("../validations");
const path = require('path');
const http = require('http');
const request = require('request');
// const fs = require('firebase-admin');

// const serviceAccount = require('../public/google-services.json');

// fs.initializeApp({
//  credential: fs.credential.cert(serviceAccount)
// });
// const firebaseAuth = fs.auth(); 


const routes = {
	analytics: require('../controllers/analytics'),
};

// const routeAuth = {
	
// }


module.exports = function(app) { 

	function makeHandlerAwareOfAsyncErrors(handler) {
		return async function(req, res, next) {
			try {
				await handler(req, res);
			} catch (error) {
				next(error);
			}
		};
	}

	app.get('/.netlify/functions/index', function(req, res) {
	    res.sendFile(path.join(__dirname + '/../app/index.html')); // Set index.html as layout
	});

	// We define AUTH Admin the standard REST APIs for each route (if they exist). 

	// We define the CUSTOMES REST APIs for each route (if they exist).


	// We define the standard REST APIs for each route (if they exist).
	for (const [routeName, routeController] of Object.entries(routes)) {
		
		
		if (routeController.index) {
			app.get(
				`/.netlify/functions/index/api/${routeName}`,
	      		// [middlewareJwt.verifyToken], // Activated Auth JsonWebtoken
	      		makeHandlerAwareOfAsyncErrors(routeController.index)
	      );
		}
		if (routeController.getByCustome) {
			app.get(
				`/.netlify/functions/index/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.getByCustome)
				);
		}
		if (routeController.getById) {
			app.get(
				`/.netlify/functions/index/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.getById)
				);
		}
		if (routeController.create) {
			app.post(
				`/.netlify/functions/index/api/${routeName}`,
				// [
				// 	middlewareJwt.verifyToken
				// ],
				makeHandlerAwareOfAsyncErrors(routeController.create)
				);
		}
		if (routeController.update) {
			app.put(
				`/.netlify/functions/index/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.update)
				);
		}
		if (routeController.updateStatus) {
			app.put(
				`/.netlify/functions/index/api/${routeName}/:id/:status`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.updateStatus)
				);
		}
		if (routeController.removeAll) {
			app.delete(
				`/.netlify/functions/index/api/${routeName}/removeAll`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.removeAll)
				);
		}
		if (routeController.removeMulti) {
			app.delete(
				`/.netlify/functions/index/api/${routeName}/removeMulti`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.removeMulti)
				);
		}
		if (routeController.remove) {
			app.delete(
				`/.netlify/functions/index/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.remove)
				);
		}
		
	}

	// For Local 
	for (const [routeName, routeController] of Object.entries(routes)) {
		
		
		if (routeController.index) {
			app.get(
				`/api/${routeName}`,
	      		// [middlewareJwt.verifyToken], // Activated Auth JsonWebtoken
	      		makeHandlerAwareOfAsyncErrors(routeController.index)
	      );
		}
		if (routeController.getByCustome) {
			app.get(
				`/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.getByCustome)
				);
		}
		if (routeController.getById) {
			app.get(
				`/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.getById)
				);
		}
		if (routeController.create) {
			app.post(
				`/api/${routeName}`,
				// [
				// 	middlewareJwt.verifyToken
				// ],
				makeHandlerAwareOfAsyncErrors(routeController.create)
				);
		}
		if (routeController.update) {
			app.put(
				`/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.update)
				);
		}
		if (routeController.updateStatus) {
			app.put(
				`/api/${routeName}/:id/:status`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.updateStatus)
				);
		}
		if (routeController.removeAll) {
			app.delete(
				`/api/${routeName}/removeAll`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.removeAll)
				);
		}
		if (routeController.removeMulti) {
			app.delete(
				`/api/${routeName}/removeMulti`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.removeMulti)
				);
		}
		if (routeController.remove) {
			app.delete(
				`/api/${routeName}/:id`,
				// [middlewareJwt.verifyToken],
				makeHandlerAwareOfAsyncErrors(routeController.remove)
				);
		}
		
	}

}