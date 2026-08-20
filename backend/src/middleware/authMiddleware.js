const { verificarToken } = require('../utils/jwt');

function protegerRuta(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No se proporcionó un token de acceso'
    });
  }

  const token = authHeader.split(' ')[1];

  try {

    const payload = verificarToken(token);

    if (payload.emailVerificado === false) {
      return res.status(403).json({
        error: 'Debes verificar tu correo electrónico para acceder a esta función'
      });
    }

    req.usuario = payload;

    next();

  } catch (error) {

    return res.status(401).json({
      error: 'Token inválido o expirado'
    });

  }

}

function verificarRol(...rolesPermitidos) {

  return (req, res, next) => {

    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: 'No tienes permisos para realizar esta acción'
      });
    }

    next();

  };

}

module.exports = {
  protegerRuta,
  verificarRol
};