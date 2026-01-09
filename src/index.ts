import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/errorHandler';
import { sequelize } from './config/database';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
app.use(cors({
    origin:true,
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

sequelize.authenticate().then(() => {
    sequelize.sync({ alter: true }) // updates tables safely
        .then(() => console.log("All models synced"))
        .catch(err => console.error("Sync error:", err));
    console.log('Database connected');
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', userRoutes);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});