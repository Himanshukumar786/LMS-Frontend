import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import courseRoutes from './routes/courseRoutes.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser()); 

app.use(morgan('dev'));

app.use('/ping', function(req, res) {
    res.send('pong');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);

app.all('*', (req, res) => {
    res.status(404).send('OOPS! 404 Page Not Found');
});

app.use(errorMiddleware);

export default app;
