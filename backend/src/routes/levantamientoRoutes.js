const express = require('express');
const router = express.Router();

const {
  obtenerLevantamientos,
  obtenerLevantamiento,
  crearLevantamiento,
  actualizarLevantamiento,
  eliminarLevantamiento
} = require('../controllers/levantamientoController');

const { protegerRuta } = require('../middleware/authMiddleware');

router.use(protegerRuta);

router.get('/', obtenerLevantamientos);
router.get('/:id', obtenerLevantamiento);
router.post('/', crearLevantamiento);
router.put('/:id', actualizarLevantamiento);
router.delete('/:id', eliminarLevantamiento);

module.exports = router;