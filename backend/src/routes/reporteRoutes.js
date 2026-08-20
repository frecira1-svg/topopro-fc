const express = require('express');
const router = express.Router();

const {
  protegerRuta
} = require('../middleware/authMiddleware');

const {
  obtenerReporteProyecto,
  obtenerReporteProyectoPDF,
  obtenerReporteProyectoExcel
} = require('../controllers/reporteController');


// ==========================================
// REPORTE TÉCNICO JSON
// ==========================================

router.get(
  '/proyecto/:id',
  protegerRuta,
  obtenerReporteProyecto
);


// ==========================================
// MEMORIA DE CÁLCULO PDF
// ==========================================

router.get(
  '/memoria-calculo/:id/pdf',
  protegerRuta,
  obtenerReporteProyectoPDF
);


// ==========================================
// MEMORIA DE CÁLCULO EXCEL
// ==========================================

router.get(
  '/memoria-calculo/:id/excel',
  protegerRuta,
  obtenerReporteProyectoExcel
);


module.exports = router;