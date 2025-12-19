const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllProviders, getProvidersByService, getProviderById, 
createProvider, updateProvider, getMyProfile } = require('../controllers/providerController');
router.get('/', getAllProviders);
router.get('/service/:serviceId', getProvidersByService);
router.get('/profile', auth, getMyProfile);
router.get('/:id', getProviderById);
router.post('/', auth, createProvider);
router.put('/profile', auth, updateProvider);
module.exports = router;