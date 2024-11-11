import { HttpStatusCode } from 'axios';
import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { sendJsonResponse } from './utils/jsonResponse.js';
import hawaiiDataRouter from './routes/hawaiiDataRoutes.js';
import chatGptRouter from './routes/chatGptRoutes.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || '8000';

app.use(json());
app.use(cors());

app.use('/api', hawaiiDataRouter);
app.use('/api', chatGptRouter);

// Define root route
app.get('/', (req, res) => {
    sendJsonResponse(res, HttpStatusCode.Ok, 'API is operational.');
});

// Listening on 0.0.0.0 to allow access from other devices on the network
app.listen(PORT, '0.0.0.0', () => {
    console.log('API is operational.');
});

export default app;
