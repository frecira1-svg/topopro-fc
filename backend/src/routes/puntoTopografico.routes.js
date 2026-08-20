const express = require('express');
const router = express.Router();

const {

  crear,

  listar,

  listarPorProyecto,

  obtener,

  actualizar,

  eliminar,

  listarCercanos,

  importarCSV,

  uploadCSV

} = require('../controllers/puntoTopografico.controller');

const {

  protegerRuta

} = require('../middleware/authMiddleware');


// ===============================
// PUNTOS TOPOGRÁFICOS
// ===============================

// Crear punto
router.post('/', protegerRuta, crear);

// Listar todos los puntos
router.get('/', protegerRuta, listar);

// Puntos cercanos (consulta espacial)
router.get('/cercanos', protegerRuta, listarCercanos);

// Listar puntos de un proyecto específico
router.get('/proyecto/:proyectoId', protegerRuta, listarPorProyecto);

// Importar puntos desde CSV
router.post('/importar/:proyectoId', protegerRuta, uploadCSV.single('archivo'), importarCSV);

// Obtener un punto por ID
router.get('/:id', protegerRuta, obtener);

// Actualizar un punto
router.put('/:id', protegerRuta, actualizar);

// Eliminar un punto
router.delete('/:id', protegerRuta, eliminar);


module.exports = router;