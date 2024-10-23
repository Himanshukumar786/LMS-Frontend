import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser()); 

export default app;