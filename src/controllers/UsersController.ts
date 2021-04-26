import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { validate } from 'email-validator';

import db from '../database/connection';

import User from '../models/User';

/**
 * List all the User entries stored in the database. In the response header the atribute named
 * X-Total-Count list the total number of users. If there are no users in the database, or if
 * there is a problem with the database access, an error message will be sent as part of the 
 * response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function index(request: Request, response: Response) {
	let result;

	try {
		const users = await db('users').select('*');

		const [ { total } ] = await db('users').count('* as total');
		
		response.set('X-Total-Count', String(total));
		
		if (total == 0) {
			result = response.status(404).json({ message: 'There are no users in the database.'});
		}
		else {
			result = response.status(200).json(users);
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: 'Error when trying to access Users in the database.' });
	}
	
	return result;
}

/**
 * Loads a single User entry stored in the database, using the ID to search for it. If the user was
 * not found or if there is a problem in the database, an error message will be sent as part of the
 * response. Otherwise, the user object will be sent.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function show(request: Request, response: Response) {
	let result;

	const { id } = request.params;

	try {
		const user: User = await db('users').where('id', id).select('*').first();

		if (!user) {
			result = response.status(404).json({ message: `User with ID ${id} not found in the database.` });
		}
		else {
			result = response.status(200).json(user);
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${id} in the database.` });
	}

	return result;
}

/**
 * Creates an User entry in the database. If the email format is invalid, or if the User can't be 
 * created due to problems in the database an error message will be sent as part of the response. 
 * If the user is created, then a message containing it's ID is also sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function create(request: Request, response: Response) {
	let result;
	
	const { name, phone, email, age, weight } = request.body;

	if (!validate(email)) {
		result = response.status(400).json({ message: `The email ${email} is not in a valid format.` });
	}
	else {		
		try {
			const id = randomBytes(4).toString('hex');
			const new_user: User = { id, name, phone, email, age, weight };

			await db('users').insert(new_user);

			result = response.status(201).json({ message: `User with ID ${id} was created.` });
		}
		catch (err) {
			console.error(err);

			result = response.status(500).json({ message: 'Error when trying to insert new User in the database.' });
		}
	}

	return result;
}

/**
 * Change the attribute of a specific User entry in the database, using the ID to search and the
 * request body to specify the fields to change and the new values to be updated. If errors happen
 * during the process, messages will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function change(request: Request, response: Response) {
	let result;
	
	const { id } = request.params;
	const { name, phone, email, age, weight } = request.body;

	try {
		const user: User = await db('users').where('id', id).select('*').first();

		if (!user) {
			result = response.status(404).json({ message: `User with ID ${id} not found to be changed.` });
		}
		else {
			try {
				await db('users').where('id', id).update({ name, phone, email, age, weight });
		
				result = response.status(200).json({ message: `User with ID ${id} was updated.` });
			}
			catch (err) {
				result = response.status(500).json({ message: `Could not update User with ID ${id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${id} in the database.` });
	}

	return result;
}

/**
 * Deletes a User entry in the database, using the ID to search for it. If the user not exists in 
 * the database, or if there is a problem with the database access, or if the user was deleted or
 * if the user can not be deleted an error message will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function remove(request: Request, response: Response) {
	let result;

	const { id } = request.params;

	try {
		const user: User = await db('users').where('id', id).select('*').first();
	
		if (!user)
			result = response.status(404).json({ message: `User with ID ${id} was not found to be deleted.` });
		else {
			try {
				await db('users').where('id', id).first().delete();

				result = response.status(200).json({ message: `User with ID ${id} deleted. `});
			}
			catch (err) {
				console.error(err);

				result = response.status(500).json({ message: `Could not delete User with ID ${id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${id} in the database.` })
	}

	return result;
}

export default { index, show, create, change, remove };
