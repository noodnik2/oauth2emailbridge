import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/email', emailRoutes);

export default app;
