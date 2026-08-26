const {
  obtenerPermisos
} = require('../services/permiso.service');


// =====================================================
// VERIFICAR PERMISO DEL USUARIO
// =====================================================

function verificarPermiso(nombrePermiso) {

  return async (req, res, next) => {

    try {

      // -------------------------------------------------
      // Debe existir usuario autenticado
      // -------------------------------------------------

      if (!req.usuario) {

        return res.status(401).json({
          error: 'Usuario no autenticado'
        });

      }


      // -------------------------------------------------
      // ADMIN tiene acceso total
      // -------------------------------------------------

      if (req.usuario.rol === 'ADMIN') {
        return next();
      }


      // -------------------------------------------------
      // Obtener permisos del usuario
      // -------------------------------------------------

      const permisos = await obtenerPermisos(
        Number(req.usuario.id)
      );


      // -------------------------------------------------
      // Verificar permiso solicitado
      // -------------------------------------------------

      if (!permisos[nombrePermiso]) {

        return res.status(403).json({
          error: `No tienes permiso para realizar esta acción (${nombrePermiso})`
        });

      }


      next();

    } catch (error) {

      console.error(
        'ERROR VERIFICANDO PERMISO:',
        error
      );

      return res.status(
        error.status || 500
      ).json({
        error:
          error.message ||
          'Error al verificar permisos'
      });

    }

  };

}


module.exports = {
  verificarPermiso
};