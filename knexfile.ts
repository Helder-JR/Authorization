import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export default {
	development: {
		client: 'sqlite3',
		connection: {
			filename: path.resolve(__dirname, 'src', 'database', 'db.sqlite')
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations')
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},
		useNullAsDefault: true
	},

	staging: {
		client: 'postgresql',
		connection: {
			database: process.env.DB_NAME,
			user:     process.env.DB_USER,
			password: process.env.DB_PASS
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations')
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},
		useNullAsDefault: true
	},

	production: {
		client: 'postgresql',
		connection: {
			database: process.env.DB_NAME,
			user:     process.env.DB_USER,
			password: process.env.DB_PASS
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: path.resolve(__dirname, 'src', 'database', 'migrations')
		},
		seeds: {
			directory: path.resolve(__dirname, 'src', 'database', 'seeds')
		},
		useNullAsDefault: true
	}
};
