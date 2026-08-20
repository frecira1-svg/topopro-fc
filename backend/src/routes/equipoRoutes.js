const express = require('express');
const router = express.Router();

const {
  obtenerEquipos,
  obtenerEquipo,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo
} = require('../controllers/equipoController');

const { protegerRuta } = require('../middleware/authMiddleware');

router.use(protegerRuta);

router.get('/', obtenerEquipos);
router.get('/:id', obtenerEquipo);
router.post('/', crearEquipo);
router.put('/:id', actualizarEquipo);
router.delete('/:id', eliminarEquipo);

module.exports = router;