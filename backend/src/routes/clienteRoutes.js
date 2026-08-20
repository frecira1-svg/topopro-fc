const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/authMiddleware');

const {
  obtenerClientes,
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/clienteController');

router.use(protegerRuta);

router.get('/', obtenerClientes);
router.get('/:id', obtenerCliente);
router.post('/', crearCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;