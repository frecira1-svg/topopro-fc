const prisma = require('../lib/prisma');


// ===============================
// CREAR PUBLICACIÓN
// ===============================

async function crearPublicacion({ titulo, contenido, tipo, imagen, usuarioId, rolUsuario }) {

  if (tipo === 'NOTICIA' && rolUsuario !== 'ADMIN') {
    const error = new Error('Solo un administrador puede publicar noticias');
    error.status = 403;
    throw error;
  }

  const publicacion = await prisma.publicacion.create({
    data: {
      titulo,
      contenido,
      tipo: tipo || 'COMUNIDAD',
      imagen,
      usuarioId
    }
  });

  return publicacion;

}


// ===============================
// LISTAR PUBLICACIONES
// ===============================

async function obtenerPublicaciones(tipo) {

  return await prisma.publicacion.findMany({

    where: tipo ? { tipo } : {},

    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, foto: true }
      },
      _count: {
        select: { comentarios: true }
      }
    },

    orderBy: {
      createdAt: 'desc'
    }

  });

}


// ===============================
// OBTENER PUBLICACIÓN POR ID (con comentarios)
// ===============================

async function obtenerPublicacionPorId(id) {

  const publicacion = await prisma.publicacion.findUnique({

    where: { id: Number(id) },

    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, foto: true }
      },
      comentarios: {
        include: {
          usuario: {
            select: { id: true, nombre: true, apellido: true, foto: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }

  });

  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }

  return publicacion;

}


// ===============================
// ACTUALIZAR PUBLICACIÓN
// ===============================

async function actualizarPublicacion(id, datos, usuarioId, rolUsuario) {

  const publicacion = await prisma.publicacion.findUnique({
    where: { id: Number(id) }
  });

  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }

  if (publicacion.usuarioId !== usuarioId && rolUsuario !== 'ADMIN') {
    const error = new Error('No tienes permiso para editar esta publicación');
    error.status = 403;
    throw error;
  }

  return await prisma.publicacion.update({
    where: { id: Number(id) },
    data: {
      titulo: datos.titulo,
      contenido: datos.contenido,
      imagen: datos.imagen
    }
  });

}


// ===============================
// ELIMINAR PUBLICACIÓN
// ===============================

async function eliminarPublicacion(id, usuarioId, rolUsuario) {

  const publicacion = await prisma.publicacion.findUnique({
    where: { id: Number(id) }
  });

  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }

  if (publicacion.usuarioId !== usuarioId && rolUsuario !== 'ADMIN') {
    const error = new Error('No tienes permiso para eliminar esta publicación');
    error.status = 403;
    throw error;
  }

  await prisma.publicacion.delete({
    where: { id: Number(id) }
  });

  return { mensaje: 'Publicación eliminada correctamente' };

}


// ===============================
// CREAR COMENTARIO
// ===============================

async function crearComentario({ contenido, usuarioId, publicacionId }) {

  const publicacion = await prisma.publicacion.findUnique({
    where: { id: Number(publicacionId) }
  });

  if (!publicacion) {
    const error = new Error('Publicación no encontrada');
    error.status = 404;
    throw error;
  }

  const comentario = await prisma.comentario.create({
    data: {
      contenido,
      usuarioId,
      publicacionId: Number(publicacionId)
    },
    include: {
      usuario: {
        select: { id: true, nombre: true, apellido: true, foto: true }
      }
    }
  });

  return comentario;

}


// ===============================
// ELIMINAR COMENTARIO
// ===============================

async function eliminarComentario(id, usuarioId, rolUsuario) {

  const comentario = await prisma.comentario.findUnique({
    where: { id: Number(id) }
  });

  if (!comentario) {
    const error = new Error('Comentario no encontrado');
    error.status = 404;
    throw error;
  }

  if (comentario.usuarioId !== usuarioId && rolUsuario !== 'ADMIN') {
    const error = new Error('No tienes permiso para eliminar este comentario');
    error.status = 403;
    throw error;
  }

  await prisma.comentario.delete({
    where: { id: Number(id) }
  });

  return { mensaje: 'Comentario eliminado correctamente' };

}


module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  actualizarPublicacion,
  eliminarPublicacion,
  crearComentario,
  eliminarComentario
};