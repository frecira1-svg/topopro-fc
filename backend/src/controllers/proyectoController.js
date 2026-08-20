const prisma = require('../lib/prisma');


// =====================================================
// OBTENER TODOS LOS PROYECTOS
// =====================================================

const obtenerProyectos = async (req, res) => {

  try {

    const usuarioId = Number(req.usuario.id);
    const rol = req.usuario.rol;

    const proyectos = await prisma.proyecto.findMany({

      where: rol === 'ADMIN'
        ? {}
        : {
            usuarioId
          },

      include: {

        usuario: {

          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true
          }

        }

      },

      orderBy: {
        createdAt: 'desc'
      }

    });

    res.json(proyectos);

  } catch (error) {

    console.error('ERROR OBTENIENDO PROYECTOS:', error);

    res.status(500).json({
      error: 'Error al obtener los proyectos'
    });

  }

};


// =====================================================
// OBTENER UN PROYECTO POR ID
// =====================================================

const obtenerProyecto = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const usuarioId = Number(req.usuario.id);
    const rol = req.usuario.rol;


    if (Number.isNaN(id)) {

      return res.status(400).json({
        error: 'ID de proyecto inválido'
      });

    }


    const proyecto = await prisma.proyecto.findFirst({

      where: {

        id,

        ...(rol === 'ADMIN'
          ? {}
          : {
              usuarioId
            })

      },

      include: {
        usuario: true
      }

    });


    if (!proyecto) {

      return res.status(404).json({
        error:
          'Proyecto no encontrado o no tienes permisos para acceder a él'
      });

    }


    res.json(proyecto);

  } catch (error) {

    console.error('ERROR OBTENIENDO PROYECTO:', error);

    res.status(500).json({
      error: 'Error del servidor'
    });

  }

};


// =====================================================
// CREAR PROYECTO
// =====================================================

const crearProyecto = async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      cliente,
      ubicacion,
      estado,
      latitud,
      longitud
    } = req.body;


    if (!nombre || !nombre.trim()) {

      return res.status(400).json({
        error: 'El nombre del proyecto es obligatorio'
      });

    }


    const proyecto = await prisma.proyecto.create({

      data: {

        nombre,
        descripcion,
        cliente,
        ubicacion,

        estado:
          estado || 'EN_PROGRESO',

        latitud:
          latitud ?? null,

        longitud:
          longitud ?? null,

        usuarioId:
          Number(req.usuario.id)

      }

    });


    res.status(201).json(proyecto);

  } catch (error) {

    console.error('ERROR CREANDO PROYECTO:', error);

    res.status(500).json({
      error: 'Error al crear el proyecto'
    });

  }

};


// =====================================================
// ACTUALIZAR PROYECTO
// =====================================================

const actualizarProyecto = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const usuarioId = Number(req.usuario.id);
    const rol = req.usuario.rol;


    if (Number.isNaN(id)) {

      return res.status(400).json({
        error: 'ID de proyecto inválido'
      });

    }


    // -------------------------------------------------
    // Verificar existencia y permisos
    // -------------------------------------------------

    const proyecto = await prisma.proyecto.findFirst({

      where: {

        id,

        ...(rol === 'ADMIN'
          ? {}
          : {
              usuarioId
            })

      }

    });


    if (!proyecto) {

      return res.status(404).json({

        error:
          'Proyecto no encontrado o no tienes permisos para modificarlo'

      });

    }


    // -------------------------------------------------
    // Evitar modificar campos protegidos
    // -------------------------------------------------

    const {
      id: idBody,
      usuarioId: usuarioIdBody,
      createdAt,
      updatedAt,
      ...datosActualizacion
    } = req.body;


    const proyectoActualizado =
      await prisma.proyecto.update({

        where: {
          id
        },

        data: datosActualizacion

      });


    res.json(proyectoActualizado);

  } catch (error) {

    console.error('ERROR ACTUALIZANDO PROYECTO:', error);

    res.status(500).json({
      error: 'Error al actualizar el proyecto'
    });

  }

};


// =====================================================
// ELIMINAR PROYECTO
// =====================================================

const eliminarProyecto = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const usuarioId = Number(req.usuario.id);
    const rol = req.usuario.rol;


    if (Number.isNaN(id)) {

      return res.status(400).json({
        error: 'ID de proyecto inválido'
      });

    }


    // -------------------------------------------------
    // Verificar existencia y permisos
    // -------------------------------------------------

    const proyecto = await prisma.proyecto.findFirst({

      where: {

        id,

        ...(rol === 'ADMIN'
          ? {}
          : {
              usuarioId
            })

      }

    });


    if (!proyecto) {

      return res.status(404).json({

        error:
          'Proyecto no encontrado o no tienes permisos para eliminarlo'

      });

    }


    await prisma.proyecto.delete({

      where: {
        id
      }

    });


    res.json({

      mensaje:
        'Proyecto eliminado correctamente'

    });

  } catch (error) {

    console.error('ERROR ELIMINANDO PROYECTO:', error);

    res.status(500).json({
      error: 'Error al eliminar el proyecto'
    });

  }

};


// =====================================================
// PROYECTOS CERCANOS
// =====================================================

const proyectosCercanosController = async (req, res) => {

  try {

    const {
      lat,
      lng,
      radioKm
    } = req.query;


    const usuarioId = Number(req.usuario.id);
    const rol = req.usuario.rol;


    if (!lat || !lng || !radioKm) {

      return res.status(400).json({

        error:
          'lat, lng y radioKm son obligatorios'

      });

    }


    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radioMetros =
      Number(radioKm) * 1000;


    if (
      Number.isNaN(latNum) ||
      Number.isNaN(lngNum) ||
      Number.isNaN(radioMetros)
    ) {

      return res.status(400).json({

        error:
          'Los valores de ubicación deben ser numéricos'

      });

    }


    let proyectos;


    // -------------------------------------------------
    // ADMIN → todos los proyectos cercanos
    // USUARIO → solamente sus proyectos
    // -------------------------------------------------

    if (rol === 'ADMIN') {

      proyectos = await prisma.$queryRaw`

        SELECT

          id,
          nombre,
          descripcion,
          cliente,
          ubicacion,
          estado,
          latitud,
          longitud,

          ST_Distance(

            ubicacion_geo,

            ST_SetSRID(

              ST_MakePoint(
                ${lngNum},
                ${latNum}
              ),

              4326

            )::geography

          ) / 1000 AS distancia_km

        FROM proyectos

        WHERE ubicacion_geo IS NOT NULL

          AND ST_DWithin(

            ubicacion_geo,

            ST_SetSRID(

              ST_MakePoint(
                ${lngNum},
                ${latNum}
              ),

              4326

            )::geography,

            ${radioMetros}

          )

        ORDER BY distancia_km ASC

      `;

    } else {

      proyectos = await prisma.$queryRaw`

        SELECT

          id,
          nombre,
          descripcion,
          cliente,
          ubicacion,
          estado,
          latitud,
          longitud,

          ST_Distance(

            ubicacion_geo,

            ST_SetSRID(

              ST_MakePoint(
                ${lngNum},
                ${latNum}
              ),

              4326

            )::geography

          ) / 1000 AS distancia_km

        FROM proyectos

        WHERE ubicacion_geo IS NOT NULL

          AND "usuarioId" = ${usuarioId}

          AND ST_DWithin(

            ubicacion_geo,

            ST_SetSRID(

              ST_MakePoint(
                ${lngNum},
                ${latNum}
              ),

              4326

            )::geography,

            ${radioMetros}

          )

        ORDER BY distancia_km ASC

      `;

    }


    res.json(proyectos);

  } catch (error) {

    console.error(
      'ERROR BUSCANDO PROYECTOS CERCANOS:',
      error
    );

    res.status(500).json({

      error:
        'Error al buscar proyectos cercanos'

    });

  }

};


// =====================================================
// EXPORTACIONES
// =====================================================

module.exports = {

  obtenerProyectos,
  obtenerProyecto,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto,
  proyectosCercanosController

};