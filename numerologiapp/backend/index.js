require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
const { initCronJobs } = require('./helpers/cron-jobs');
const { initAdmin } = require('./helpers/init-admin');

// Crear servidor express
const app = express();

// Base de datos
dbConnection();

// Initialize Admin
initAdmin();

// CORS (solo necesario si el front está en otro dominio; aquí lo dejamos por si acaso)
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Iniciar cron jobs
initCronJobs();

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/readings', require('./routes/readings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/mercadopago', require('./routes/mercadopago'));

// Servir el frontend (dist de Vite/Vue)
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Para cualquier ruta que no sea /api/*, devolver index.html (Vue Router SPA)
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Escuchar peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
