import express from 'express';

import AuthController, { verify } from './src/controllers/AuthController';
import UsersController from './src/controllers/UsersController';
import AddressesController from './src/controllers/AddressesController';
import HomesController from './src/controllers/HomesController';

const routes = express.Router();

// Routes that cover the operations of Administrator.

// Ruute that creates a new Administrator.
routes.post('/admin', verify, AuthController.register);
// Ruute that log in a existing administrator.
routes.post('/login', AuthController.login);


// Routes that cover the operations of User.

// List all Users.
routes.get('/users', verify, UsersController.index);
// Show a single User.
routes.get('/users/:id', verify, UsersController.show);
// Create a new User.
routes.post('/users', verify, UsersController.create);
// Alter a existing User.
routes.put('/users/:id', verify, UsersController.change);
// Remove a User.
routes.delete('/users/:id', verify, UsersController.remove);


// Routes that cover the operations of Address.

// List all Addresses.
routes.get('/addresses', verify, AddressesController.index);
// Show a single Address.
routes.get('/addresses/:id', verify, AddressesController.show);
// Create a new Address.
routes.post('/addresses', verify, AddressesController.create);
// Alter a existing Address.
routes.put('/addresses/:id', verify, AddressesController.change);
// Remove a Address.
routes.delete('/addresses/:id', verify, AddressesController.remove);

// Routes that cover the operations related to Homes.

// Show all homes of a specific user.
routes.get('/addressesof/:user_id', verify, HomesController.showAddressesOfUser);
// Show all homes of a specific user.
routes.get('/usersof/:address_id', verify, HomesController.showUsersOfAddress);
// Associate an User without address to a specific address.
routes.post('/homes/:user_id/:address_id', verify, HomesController.associate);
// Deassociate an User from a specific Address.
routes.delete('/homes/:user_id/:address_id', verify, HomesController.deassociate);

export default routes;
