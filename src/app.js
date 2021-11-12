import express from 'express';

import database from './libs/database.js';

import errorMiddleware from './middlewares/errors.js';

//IMPORTATIONS DES ROUTES sb

database();

const app = express()

app.use(express.json());

app.use((req, res, next) => {

    res.header('base_url', process.env.BASE_URL);
    next();
});

//AJOUT DES ROUTES
//app.use('/planets', planetsRoutes);

app.use(errorMiddleware);

export default app;