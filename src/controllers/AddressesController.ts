import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import db from '../database/connection';

import Address from '../models/Address';

/**
 * List all the Address entries stored in the database. In the response header the atribute named
 * X-Total-Count list the total number of addresses. If there are no addresses in the database, or 
 * if there is a problem with the database access, an error message will be sent as part of the 
 * response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function index(request: Request, response: Response) {
	let result;

	try {
		const addresses = await db('addresses').select('*');

		const [ { total } ] = await db('addresses').count('* as total');
		
		response.set('X-Total-Count', String(total));
		
		if (total == 0) {
			result = response.status(404).json({ message: 'There are no Addresses in the database.'});
		}
		else {
			result = response.status(200).json(addresses);
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: 'Error when trying to access Addresses in the database.' })
	}
	
	return result;
}

/**
 * Loads a single Address entry stored in the database, using the ID to search for it. If the 
 * address was not found or if there is a problem in the database, an error message will be sent 
 * as part of the * response. Otherwise, the address object will be sent.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
 async function show(request: Request, response: Response) {
	let result;

	const { id } = request.params;

	try {
		const address: Address = await db('addresses').where('id', id).select('*').first();

		if (!address) {
			result = response.status(404).json({ message: `Address with ID ${id} not found in the database.` })
		}
		else {
			result = response.status(200).json(address);
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access Address with ID ${id} in the database.` });
	}

	return result;
}

/**
 * Creates an Address entry in the database. If the Address can't be created due to problems in the 
 * database an error message will be sent as part of the response. If the user is created, then a 
 * message containing it's ID is also sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function create(request: Request, response: Response) {
	let result;
	
	const { address, number, complement, zipcode, city, state } = request.body;

	try {
		const id = randomBytes(4).toString('hex');
		const new_address: Address = { id, address, number, complement, zipcode, city, state };

		await db('addresses').insert(new_address);

		result = response.status(201).json({ message: `Address with ID ${id} was created.` });
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: 'Error when trying to insert new Address in the database.' });
	}

	return result;
}

/**
 * Change the attribute of a specific Address entry in the database, using the ID to search and the
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
	const { address, number, complement, zipcode, city, state } = request.body;

	try {
		const current_address: Address = await db('addresses').where('id', id).select('*').first();

		if (!current_address) {
			result = response.status(404).json({ message: `Address with ID ${id} not found to be changed.` });
		}
		else {
			await db('addresses').where('id', id).update({ address, number, complement, zipcode, city, state });
	
			result = response.status(200).json({ message: `Address with ID ${id} was updated.` })
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access Address with ID ${id} in the database.` });
	}

	return result;
}

/**
 * Deletes a Address entry in the database, using the ID to search for it. If the address not exists
 * in the database, or if there is a problem with the database access, or if the address was deleted 
 * or if the user can not be deleted, an error message will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function remove(request: Request, response: Response) {
	let result;

	const { id } = request.params;

	try {
		const address: Address = await db('addresses').where('id', id).select('*').first();
	
		if (!address)
			result = response.status(400).json({ message: `Address with ID ${id} was not found to be deleted.` });
		else {
			try {
				await db('addresses').where('id', id).first().delete();

				result = response.status(200).json({ message: `Address with ID ${id} deleted.` });
			}
			catch (err) {
				console.error(err);

				result = response.status(500).json({ message: `Could not delete Address with ID ${id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access Address with ID ${id} in the database.` });
	}

	return result;
}

export default { index, show, create, change, remove };
