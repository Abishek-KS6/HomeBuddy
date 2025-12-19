const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, createService } = require('../controllers/serviceController');
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createService);
module.exports = router;
