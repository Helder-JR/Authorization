import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes';

// Loading of the environment variables in .env file.
dotenv.config();

// Host address.
const host: any = process.env.API_HOST || '127.0.0.1';
// Port used by the API.
const port: any = process.env.API_PORT || 3333;

const app = express();

// Specifies the API to use JSON to parse server responses.
app.use(express.json());
// Specifies the API to use CORS to prevent XSS attacks.
app.use(cors());
// Specifies the API to use methods from the routes file.
app.use('/api', routes);

// Starting of the server listening at the specified host and port.
app.listen(port, host, () => {
	console.log(`Server is running at ${host}:${port}`);
});
