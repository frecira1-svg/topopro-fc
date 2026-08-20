const express = require('express');
const router = express.Router();

const {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar,
  comentar,
  eliminarComentarioController
} = require('../controllers/publicacion.controller');

const { protegerRuta } = require('../middleware/authMiddleware');


// Crear publicación (noticia o comunidad, según rol)
router.post('/', protegerRuta, crear);

// Listar publicaciones (opcionalmente filtradas por ?tipo=NOTICIA o ?tipo=COMUNIDAD)
router.get('/', protegerRuta, listar);

// Obtener una publicación con sus comentarios
router.get('/:id', protegerRuta, obtener);

// Actualizar publicación
router.put('/:id', protegerRuta, actualizar);

// Eliminar publicación
router.delete('/:id', protegerRuta, eliminar);

// Comentar en una publicación
router.post('/:id/comentarios', protegerRuta, comentar);

// Eliminar un comentario
router.delete('/comentarios/:comentarioId', protegerRuta, eliminarComentarioController);


module.exports = router;