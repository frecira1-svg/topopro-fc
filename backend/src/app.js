require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const proyectoRoutes = require('./routes/proyectoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const puntoTopograficoRoutes = require('./routes/puntoTopografico.routes');
const levantamientoRoutes = require('./routes/levantamientoRoutes');
const archivoRoutes = require('./routes/archivo.routes');
const publicacionRoutes = require('./routes/publicacion.routes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const permisoRoutes = require('./routes/permiso.routes');
const errorHandler = require('./middleware/errorHandler');


const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    process.env.APP_URL,
    'http://localhost:4200'
  ],
  credentials: true
}));

app.use(express.json());

// Limita intentos de login/registro/recuperación para evitar fuerza bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 intentos por IP en la ventana
  message: {
    error: 'Demasiados intentos. Intenta de nuevo en unos minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/puntos', puntoTopograficoRoutes);
app.use('/api/levantamientos', levantamientoRoutes);
app.use('/api/archivos', archivoRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/permisos', permisoRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de TopoPro funcionando'
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 [TopoPro Backend] Servidor corriendo en http://localhost:${PORT}`);
});