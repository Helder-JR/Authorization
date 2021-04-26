import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import db from '../database/connection';

import Administrator from '../models/Administrator';

dotenv.config();

/**
 * Logs the Administrator to the system, allowing to use other routes. The login will generate a
 * JWT based in the TOKEN_SECRET loaded in the .env file. The token will be sent as part of the 
 * response header. If error related to the password or database occur, then a error  message will
 * be sent as part of the response.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function login(request: Request, response: Response) {
	let result;

	const { username, password } = request.body;

	try {
		const admin: Administrator = await db('administrators').where('username', username).select('*').first();
		
		if (!admin) {
			result = response.status(400).json({ message: `Administrator with username ${username} not found in the database.` });	
		}
		else {
			const validPassword = bcrypt.compareSync(password, admin.password);

			if (!validPassword) {
				result = response.status(400).json({ message: `Password for Administrator ${username} is not valid.` });
			}
			else {
				const token = jwt.sign({ username: admin.username, admin: true }, String(process.env.TOKEN_SECRET), { expiresIn: '1h' });
				
				response.set('Authorization-Token', token);

				result = response.status(200).json({ message: `Administrator ${username} has logged in.` });
			}
		}
	}
	catch (err) {
		console.error(err);
		
		result = response.status(500).json({ message: 'Error when trying to access Administrators in the database.' });
	}

	return result;
}

/**
 * Register a new Administrator to the system. The password will be encrypted by bcrypt, having a 
 * workload defined by the number of ROUNDS on the .env file. The new Administrator credentials 
 * will be stored in the database. If errors related to username or database occur, then error 
 * messages will be sent as part of the response, and the same will happen if the process succeeds.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @returns The response to be sent to the frontend.
 */
async function register(request: Request, response: Response) {
	let result;

	const { username, password } = request.body;

	try {
		const admin: Administrator = await db('administrators').where('username', username).select('*').first();
		
		if (admin) {
			result = response.status(400).json({ message: `Administrator with username ${username} already registered.` });	
		}
		else {
			const rounds = Number(process.env.ROUNDS);
			const hashedPassword = bcrypt.hashSync(password, rounds);
			
			try {
				const new_admin: Administrator = { username, password: hashedPassword };

				await db('administrators').insert(new_admin);

				result = response.status(201).json({ message: `Administrator with username ${username} created.` });
			}
			catch (err) {
				console.error(err);
				
				result = response.status(500).json({ message: 'Error when trying to insert new Administrator in the database.' });
			}
		}
	}
	catch (err) {
		console.error(err);

		result = response.status(500).json({ message: 'Error when trying to access Administrators in the database.' });
	}

	return result;
}

/**
 * Verify if a Administrator is logged in, to give the possibility to use the routes of the system.
 * The verification will use the JWT token in the request header, and validate it using the 
 * TOKEN_SECRET on the .env file. If the request doesn't contain the token or if it is not valid, a
 * error message will be sent as part of the resonse. If the process succeeds, then the next 
 * function will be called.
 * 
 * @param request The request sent to the backend.
 * @param response The response sent to the frontend.
 * @param next The next function to be executed after this one.
 * @returns The response to be sent to the frontend.
 */
export async function verify(request: Request, response: Response, next: NextFunction) {
	let result;
	
	const token = request.header('Authorization-Token');

	if (!token) {
		result = response.status(401).json({ message: 'Access denied due to lack of authorization token.' });
	}
	else {
		try {
			const verified = jwt.verify(token, String(process.env.TOKEN_SECRET));
			
			if (verified) {
				next();
			}
		}
		catch (err) {
			result = response.status(400).json({ message: 'Invalid authorization token.'});
		}
	}

	return result;
}

export default { login, register };
