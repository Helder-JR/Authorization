import { Request, Response } from 'express';

import db from '../database/connection';

import Address from '../models/Address';
import User from '../models/User';
import Home from '../models/Home';

/**
 * Associates an User to an Address, if both exist. This method allows a User to be associated to 
 * more than one Address, and one Address to have more than one User living on it. IF errors occur
 * during the process, messages will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function associate(request: Request, response: Response) {
	let result;
	
	const { user_id, address_id } = request.params;

	try {
		const user: User = await db('users').where('id', user_id).select('*').first();
		const address: Address = await db('addresses').where('id', address_id).select('*').first();
		
		if (!user || !address) {
			result = response.status(400).json({ message: `User with ID ${user_id} or Address with ID ${address_id} were not found.` });
		}
		else {
			try {
				const home: Home = await db('homes').where('user_id', user_id).andWhere('address_id', address_id).select('*').first();
				
				if (home) {
					result = response.status(400).json({ message: `User with ID ${user_id} and Address with ID ${address_id} are already associated.` });
				}
				else {
					const new_home: Home = { user_id, address_id };
				
					await db('homes').insert(new_home);
	
					result = response.status(201).json({ message: `User with ID ${user_id} associated to Address with ID ${address_id}.` });
				}
			}
			catch (err) {
				result = response.status(400).json({ message: `Error when trying to access Home with User ID ${user_id} and Address ID ${address_id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${user_id} or Address with ID ${address_id} in the database.` });
	}

	return result;
}

/**
 * Dissociates an User from an Address, if both exist and the home also exists. IF errors occur
 * during the process, messages will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function deassociate(request: Request, response: Response) {
	let result;

	const { user_id, address_id } = request.params;

	try {
		const user: User = await db('users').where('id', user_id).select('*').first();
		const address: Address = await db('addresses').where('id', address_id).select('*').first();
		
		if (!user || !address) {
			result = response.status(400).json({ message: `User with ID ${user_id} or Address with ID ${address_id} were not found.` });
		}
		else {
			try {
				const home: Home = await db('homes').where('user_id', user_id).andWhere('address_id', address_id).select('*').first();
				
				if (!home) {
					result = response.status(400).json({ message: `User with ID ${user_id} and Address with ID ${address_id} are not associated.` });
				}
				else {
					try {
						await db('homes').where('user_id', user_id).andWhere('address_id', address_id).first().delete();

						result = response.status(200).json({ message: `User with ID ${user_id} and Address with ID ${address_id} were dissociated.` })
					}
					catch (err) {
						console.error(err);

						result = response.status(200).json({ message: `Error when trying to dissociate Home with User ID ${user_id} and Address ID ${address_id}.` })
					}
				}
			}
			catch (err) {
				result = response.status(400).json({ message: `Error when trying to access Home with User ID ${user_id} and Address ID ${address_id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${user_id} or Address with ID ${address_id} in the database.` });
	}

	return result;
}

/**
 * Show all Addresses associated to a specific User. If the User was not on the datbase, or if the
 * User was not associated to any Address, or if happen any other error related to the database, a
 * message will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function showAddressesOfUser(request: Request, response: Response) {
	let result;

	const { user_id } = request.params;

	try {
		const user: User = await db('users').where('id', user_id).select('*').first();

		if (!user) {
			result = response.status(404).json({ message: `User with ID ${user_id} not found in the database.` });
		}
		else {
			try {
				const addresses: any = await db('homes').join('addresses', 'addresses.id', '=', 'homes.address_id').where('homes.user_id', user_id).select('addresses.*');
				
				response.set('X-Total-Count', addresses.length);

				if (addresses.length === 0) {
					result = response.status(404).json({ message: `User with ID ${user_id} does not have any Address associated.` });
				}
				else {
					result = response.status(200).json(addresses);
				}
			}
			catch (err) {
				result = response.status(404).json({ message: `Error when trying to access Addresses associated to User with ID ${user_id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access User with ID ${user_id} in the database.` });
	}

	return result;
}

/**
 * Show all Users associated to a specific Address. If the Address was not on the datbase, or if the
 * Address was not associated to any Address, or if happen any other error related to the database, a
 * message will be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function showUsersOfAddress(request: Request, response: Response) {
	let result;

	const { address_id } = request.params;

	try {
		const address: Address = await db('addresses').where('id', address_id).select('*').first();
		
		if (!address) {
			result = response.status(404).json({ message: `Address with ID ${address_id} not found in the database.` });
		}
		else {
			try {
				const users: any = await db('homes').join('users', 'users.id', '=', 'homes.user_id').where('homes.address_id', address_id).select('users.*');
				
				response.set('X-Total-Count', users.length);

				if (users.length === 0) {
					result = response.status(404).json({ message: `Address with ID ${address_id} does not have any Address associated.` });
				}
				else {
					result = response.status(200).json(users);
				}
			}
			catch (err) {
				result = response.status(404).json({ message: `Error when trying to access Users associated to Address with ID ${address_id}.` });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: `Error when trying to access Address with ID ${address_id} in the database.` });
	}

	return result;
}

export default { associate, deassociate, showAddressesOfUser, showUsersOfAddress };
