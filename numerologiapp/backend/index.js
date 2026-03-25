require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { initCronJobs } = require('./helpers/cron-jobs');
const { initAdmin } = require('./helpers/init-admin');

// Crear servidor express
const app = express();

// Base de datos
dbConnection();

// Initialize Admin
initAdmin();

// CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Iniciar cron jobs
initCronJobs();

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/readings', require('./routes/readings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/mercadopago', require('./routes/mercadopago'));

// Escuchar peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
