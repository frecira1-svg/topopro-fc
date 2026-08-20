const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/authMiddleware');

const {
  obtenerProyectos,
  obtenerProyecto,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  proyectosCercanosController
} = require('../controllers/proyectoController');

router.use(protegerRuta);

router.get('/cercanos', proyectosCercanosController);
router.get('/', obtenerProyectos);
router.get('/:id', obtenerProyecto);
router.post('/', crearProyecto);
router.put('/:id', actualizarProyecto);
router.delete('/:id', eliminarProyecto);

module.exports = router;