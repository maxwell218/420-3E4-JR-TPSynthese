import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

import pizzeriasRoutes from './routes/pizzaria.routes.js';
import customersRoutes from './routes/customer.routes.js';
import ordersRoutes from './routes/order.routes.js';

database();

const app = express()

app.use(express.json());

app.use((req, res, next) => {

    res.header('base_url', process.env.BASE_URL);
    next();
});

app.use('/pizzerias', pizzeriasRoutes);
app.use('/customers', customersRoutes);
app.use('/orders', ordersRoutes);

app.use(errorMiddleware);

export default app;